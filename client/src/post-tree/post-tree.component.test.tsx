import React from 'react'
import test from 'tape'
import sinon, { SinonStub } from 'sinon'
import { shallow, ShallowWrapper } from 'enzyme'
import { PostTreeComponent } from './post-tree.component'
import { PostTreeService } from './post-tree.service'
import { Post } from './model/post'
import faker from 'faker'
import { Dictionary } from '@core/interfaces'
import { SortOrder } from './model/sort-order'
import { TreeGroupingKey } from './model/tree-grouping-key'
import { StateProps } from './post-tree.interfaces'
import { PostLeaf } from './post-leaf/post-leaf.component'
import { PostBranch } from './post-branch/post-branch.component'

/**
 * Generates random data each time the tests are run, intended
 * to vary the tests and prevent false positives.
 *
 * - Author, location and date count vary between 3 and 10
 * - Dates may be any time between yesterday and 42 days in the past (6 weeks)
 * - The number of posts (rows) varies between 10 and 100
 */
const generateData = (): Post[] => {
  const authorCount = faker.random.number({ min: 3, max: 10 })
  const authors = Array.from(Array(authorCount)).map(() => faker.name.firstName())

  const locationCount = faker.random.number({ min: 3, max: 10 })
  const locations = Array.from(Array(locationCount)).map(() => faker.address.city())

  const dateCount = faker.random.number({ min: 3, max: 10 })
  const dateSpread = faker.random.number({ min: 1, max: 42 })
  const dates = Array.from(Array(dateCount)).map(() => faker.date.recent(dateSpread))

  const postCount = faker.random.number({ min: 10, max: 100 })

  return Array
    .from(Array(postCount))
    .map((_, id) => ({
      id,
      location: faker.random.arrayElement(locations),
      time: faker.random.arrayElement(dates),
      author: faker.random.arrayElement(authors),
      text: faker.lorem.words(),
      open: false
    }))
}

/**
 * Transforms the randomly generated data into:
 *
 * - Dictionary<Post>
 * - Branch[] (tree view)
 *
 * Sets the default groupedBy to TreeGroupingKey.Week
 */
const generateStateProps = (): StateProps => {
  const data = generateData()
  const posts: Dictionary<Post> = data
    .reduce((acc, cur) => ({
      ...acc,
      [cur.id]: {
        ...cur,
        time: parseInt(String(cur.time)),
        open: false
      }
    }), {})
  const groupedBy = TreeGroupingKey.Week
  const tree = (PostTreeService as any).groupByKey(posts, groupedBy, SortOrder.Descending)

  return {
    posts,
    tree,
    groupedBy
  }
}

interface SetupOutput extends StateProps {
  dom: ShallowWrapper
}

const setup = ({ overrideComponentDidMount = true } = {}): SetupOutput => {
  const { posts, tree, groupedBy } = generateStateProps()

  if (overrideComponentDidMount) sinon.stub(PostTreeComponent.prototype, 'componentDidMount')
  const dom = shallow(
    <PostTreeComponent
      posts={posts}
      tree={tree}
      groupedBy={groupedBy}
    />
  )

  dom.setState({ resolved: true })

  return {
    dom,
    posts,
    tree,
    groupedBy
  }
}

const cleanup = (): void => {
  (PostTreeComponent.prototype.componentDidMount as SinonStub).restore()
}

test('<PostTree /> should render three buttons, one for each grouping type', ({ assert, equal, plan, end }) => {
  const { dom } = setup()

  const buttons = dom.find('button')
  const threeButtons = buttons.length === 3

  plan(4)

  assert(threeButtons, 'there should be three buttons')

  if (!threeButtons) return

  equal(buttons.at(0).text(), 'By week', 'the first button should have label text \'By week\'')
  equal(buttons.at(1).text(), 'By author', 'the second button should have label text \'By author\'')
  equal(buttons.at(2).text(), 'By location', 'the third button should have label text \'By location\'')

  cleanup()
  end()
})

test('<PostTree /> button \'By week\' clicks should should call PostTreeService.groupPostsBy() with argument TreeGroupingKey.Week', ({ assert, end }) => {
  const { dom } = setup()

  const groupPostsBy = sinon.spy(PostTreeService, 'groupPostsBy')
  const button = dom.find('button').at(0)

  button.simulate('click')

  assert(groupPostsBy.calledWithExactly(TreeGroupingKey.Week), 'PostTreeService.groupPostsBy() should be called with argument TreeGroupingKey.Week')

  groupPostsBy.restore()
  cleanup()
  end()
})

test('<PostTree /> button \'By author\' clicks should should call PostTreeService.groupPostsBy() with argument TreeGroupingKey.Author', ({ assert, end }) => {
  const { dom } = setup()

  const groupPostsBy = sinon.spy(PostTreeService, 'groupPostsBy')
  const button = dom.find('button').at(1)

  button.simulate('click')

  assert(groupPostsBy.calledWithExactly(TreeGroupingKey.Author), 'PostTreeService.groupPostsBy() should be called with argument TreeGroupingKey.Author')

  groupPostsBy.restore()
  cleanup()
  end()
})

test('<PostTree /> button \'By location\' clicks should should call PostTreeService.groupPostsBy() with argument TreeGroupingKey.Location', ({ assert, end }) => {
  const { dom } = setup()

  const groupPostsBy = sinon.spy(PostTreeService, 'groupPostsBy')
  const button = dom.find('button').at(2)

  button.simulate('click')

  assert(groupPostsBy.calledWithExactly(TreeGroupingKey.Location), 'PostTreeService.groupPostsBy() should be called with argument TreeGroupingKey.Location')

  groupPostsBy.restore()
  cleanup()
  end()
})

test('<PostTree /> TreeElement should render a tree representation of post relationships that matches the structure of props.tree', ({ equal, end }) => {
  const { dom, tree } = setup()
  const renderedTree = shallow((dom.instance() as any).TreeElement())
  const branches = renderedTree.find(PostBranch)

  for (const [branchIndex, [expectedHeading, leaves]] of tree.entries()) {
    const branch = branches.at(branchIndex)
    const actualHeading = branch.dive().find('div > div').at(0).text()

    equal(branch.type(), PostBranch, 'branch elements should be of type PostBranch')
    equal(actualHeading, expectedHeading, 'the rendered branch heading should match the group heading in the data')

    for (const [leafIndex, postId] of leaves.entries()) {
      const leaf = branch.children().at(leafIndex)
      const renderedPostId = leaf.dive().find('div > div').text()
      const expectedPostId = `Post ${postId}`

      equal(leaf.type(), PostLeaf, 'leaf elements should be of type PostLeaf')
      equal(renderedPostId, expectedPostId, 'the order and grouping of every post should match the data')
    }
  }

  cleanup()
  end()
})
