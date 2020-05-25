import test from 'tape'
import sinon from 'sinon'
import { mockXHR200, mockXHR500 } from '@core/test'
import { postTreeActions } from './post-tree.actions'
import { PostTreeSvc } from './post-tree.service'
import { destroyStoreSession, store } from '@app/app.store'
import data from '../../../server/services/post/endpoints/posts.json'
import { Dictionary } from '@core/interfaces'
import { Post } from './model/post'
import { TreeGroupingKey } from './model/tree-grouping-key'
import { SortOrder } from './model/sort-order'
import './post-tree.reducer'

const postDictionary: Dictionary<Post> = data
  .reduce((acc, cur) => ({
    ...acc,
    [cur.id]: {
      ...cur,
      time: parseInt(String(cur.time)),
      open: false
    }
  }), {})

const setup = (): { PostTreeService: PostTreeSvc } => ({
  PostTreeService: new PostTreeSvc(store)
})

const cleanup = (): void => {
  destroyStoreSession()
}

test('PostTreeService.getPosts() should transform Post[] -> Dictionary<Post> and provide to postTreeActions.setPosts()', async ({ deepEqual, end, fail }) => {
  const { PostTreeService } = setup()

  const setPosts = sinon.spy(postTreeActions, 'setPosts')
  const fetchStub = sinon.stub(window, 'fetch')
  fetchStub.returns(Promise.resolve(mockXHR200({ data })))

  await PostTreeService.getPosts()
    .catch(() => fail())

  const { args } = setPosts.getCall(0)
  const [actual] = args
  const expected = postDictionary

  deepEqual(
    actual,
    expected,
    'PostTreeService.getPosts() should provide a transformed Post[] to postTreeActions.setPosts()'
  )

  setPosts.restore()
  fetchStub.restore()
  cleanup()
  end()
})

test('PostTreeService.getPosts() should request a tree rebuild by calling PostTreeService.rebuildTree()', async ({ assert, end, fail }) => {
  const { PostTreeService } = setup()

  const rebuildTree = sinon.spy(PostTreeService as any, 'rebuildTree')
  const fetchStub = sinon.stub(window, 'fetch')
  fetchStub.returns(Promise.resolve(mockXHR200({ data })))

  await PostTreeService.getPosts()
    .catch(() => fail())

  assert(rebuildTree.calledOnce)

  rebuildTree.restore()
  fetchStub.restore()
  cleanup()
  end()
})

test('PostTreeService.getPosts() should throw when there is a network error', async ({ pass, fail, end }) => {
  const { PostTreeService } = setup()

  const fetchStub = sinon.stub(window, 'fetch')
  fetchStub.returns(Promise.resolve(mockXHR500()))

  await PostTreeService.getPosts()
    .then(() => fail())
    .catch(() => pass())

  fetchStub.restore()
  cleanup()
  end()
})

test('PostTreeService.groupPostsBy() should set groupedBy and tree in the store by calling groupedBy() and setTree(), with SortOrder.Descending', ({ assert, end }) => {
  const { PostTreeService } = setup()

  /**
   * Mock the behaviour of the store, and
   * set the dictionary in the services
   * context
   */
  PostTreeService.context = {
    posts: postDictionary
  } as any

  const groupedBy = sinon.spy(postTreeActions, 'groupedBy')
  const setTree = sinon.spy(postTreeActions, 'setTree')

  const expectedTreeGroupingKey = TreeGroupingKey.Location
  const expectedTree = (PostTreeService as any).groupByKey(postDictionary, expectedTreeGroupingKey, SortOrder.Descending)

  PostTreeService.groupPostsBy(expectedTreeGroupingKey)

  assert(groupedBy.calledWithExactly(expectedTreeGroupingKey))
  assert(setTree.calledWithExactly(expectedTree))

  groupedBy.restore()
  setTree.restore()
  cleanup()
  end()
})

test('PostTreeService.groupPostsBy() should handle TreeGroupingKey.Week as a special case, and with SortOrder.Ascending', ({ assert, end }) => {
  const { PostTreeService } = setup()

  /**
   * Mock the behaviour of the store, and
   * set the dictionary in the services
   * context
   */
  PostTreeService.context = {
    posts: postDictionary
  } as any

  const groupedBy = sinon.spy(postTreeActions, 'groupedBy')
  const setTree = sinon.spy(postTreeActions, 'setTree')
  const generateBranchKey = (PostTreeService as any).generateWeekBranchKey

  /**
   * The branch key is bespoke and the sort order is Ascending rather than Descending
   */
  const expectedTreeGroupingKey = TreeGroupingKey.Week
  const expectedTree = (PostTreeService as any).groupByKey(postDictionary, expectedTreeGroupingKey, SortOrder.Ascending, generateBranchKey)

  PostTreeService.groupPostsBy(expectedTreeGroupingKey)

  assert(groupedBy.calledWithExactly(expectedTreeGroupingKey))
  assert(setTree.calledWithExactly(expectedTree))

  groupedBy.restore()
  setTree.restore()
  cleanup()
  end()
})

test('PostTreeService.setPostAuthor() should call postTreeActions.setPostAuthor() to emit SET_POST_AUTHOR, then rebuild tree', ({ assert, end }) => {
  const { PostTreeService } = setup()

  const setPostAuthor = sinon.spy(postTreeActions, 'setPostAuthor')
  const rebuildTree = sinon.spy(PostTreeService as any, 'rebuildTree')

  PostTreeService.setPostAuthor(4444, 'foo')

  assert(setPostAuthor.calledWithExactly(4444, 'foo'))
  assert(rebuildTree.calledOnce)

  setPostAuthor.restore()
  rebuildTree.restore()
  cleanup()
  end()
})

test('PostTreeService.setPostLocation() should call postTreeActions.setPostLocation() to emit SET_POST_LOCATION, then rebuild tree', ({ assert, end }) => {
  const { PostTreeService } = setup()

  const setPostLocation = sinon.spy(postTreeActions, 'setPostLocation')
  const rebuildTree = sinon.spy(PostTreeService as any, 'rebuildTree')

  PostTreeService.setPostLocation(4444, 'bar')

  assert(setPostLocation.calledWithExactly(4444, 'bar'))
  assert(rebuildTree.calledOnce)

  setPostLocation.restore()
  rebuildTree.restore()
  cleanup()
  end()
})

test('PostTreeService.openPost() should call postTreeActions.setPostActive() to emit SET_POST_ACTIVE with arg true', ({ assert, end }) => {
  const { PostTreeService } = setup()

  const setPostActive = sinon.spy(postTreeActions, 'setPostActive')

  PostTreeService.openPost(4444)

  assert(setPostActive.calledWithExactly(4444, true))

  setPostActive.restore()
  cleanup()
  end()
})

test('PostTreeService.closePost() should call postTreeActions.setPostActive() to emit SET_POST_ACTIVE with arg false', ({ assert, end }) => {
  const { PostTreeService } = setup()

  const setPostActive = sinon.spy(postTreeActions, 'setPostActive')

  PostTreeService.closePost(4444)

  assert(setPostActive.calledWithExactly(4444, false))

  setPostActive.restore()
  cleanup()
  end()
})
