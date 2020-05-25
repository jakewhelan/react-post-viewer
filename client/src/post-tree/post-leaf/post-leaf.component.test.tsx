import React from 'react'
import test from 'tape'
import { mount, ReactWrapper } from 'enzyme'
import faker from 'faker'
import { PostLeaf } from './post-leaf.component'
import { Props } from './post-leaf.interfaces'
import dayjs from 'dayjs'

interface SetupOutput extends Props {
  children: any
  dom: ReactWrapper
}

const setup = ({
  postId = faker.random.number(),
  location = faker.address.city(),
  time = Math.floor(faker.date.past().valueOf() / 1000),
  author = `${faker.name.firstName()} ${faker.name.lastName()}`,
  text = faker.lorem.words(),
  open = true,
  children = undefined
} = {}
): SetupOutput => {
  const dom = mount(
    <PostLeaf
      postId={postId}
      location={location}
      time={time}
      author={author}
      text={text}
      open={open}
    >
      {children}
    </PostLeaf>
  )

  return {
    dom,
    postId,
    location,
    time,
    author,
    text,
    open,
    children
  }
}

test(
  '<PostLeaf /> should render an <input> or <textarea> where the value is equal to that of each data prop: postId, location, author, text',
  ({ assert, equal, end, plan }) => {
    const {
      dom,
      postId,
      location,
      author,
      text
    } = setup()

    const inputs = [
      ['post-id', postId],
      ['location', location],
      ['author', author],
      ['text', text, 'textarea']
    ]

    /**
     * We anticipate 2 assertions per input, however
     * in the event that an input does not exist only
     * 1/2 will run for that input.
     */
    plan(inputs.length * 2)

    for (const [name, value, elementType = 'input'] of inputs) {
      const selector = `${elementType}[name="${name}"]`
      const exists = dom.exists(selector)
      assert(exists, `element <${selector}> should exist`)

      if (!exists) continue

      const input = dom.find(selector)
      equal(
        input.props().value,
        value,
        `the element <${selector}> value should be '${value}'`
      )
    }

    end()
  }
)

test(
  '<PostLeaf /> should render an <input> for data prop \'time\' where the date is formatted DD/MM/YYYY',
  ({ assert, equal, end, plan }) => {
    const {
      dom,
      time
    } = setup()

    /**
     * We anticipate 2 assertions will be executed
     * but in the event that the input doesnt exist
     * only 1 will execute
     */
    plan(2)

    const selector = 'input[name="time"]'
    const exists = dom.exists(selector)
    assert(exists, `element <${selector}> should exist`)

    if (!exists) return

    const input = dom.find(selector)
    const expectedValue = dayjs.unix(time).format('DD/MM/YYYY')
    equal(
      input.props().value,
      expectedValue,
      `the element <${selector}> value should be '${expectedValue}'`
    )

    end()
  }
)

test('<PostLeaf /> should render the input container when prop \'open\' is true', ({ assert, end }) => {
  const { dom } = setup({ open: true })

  const inputContainerVisible = dom.exists('div.is-open')
  assert(inputContainerVisible)

  end()
})

test('<PostLeaf /> should NOT render the input container when prop \'open\' is false', ({ assert, end }) => {
  const { dom } = setup({ open: false })

  const inputContainerNotVisible = !dom.exists('div.is-open')
  assert(inputContainerNotVisible)

  end()
})
