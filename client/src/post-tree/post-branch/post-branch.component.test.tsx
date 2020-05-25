import React from 'react'
import test from 'tape'
import { mount, ReactWrapper } from 'enzyme'
import faker from 'faker'
import { PostBranch } from './post-branch.component'

const setup = ({ title = 'foo', children = undefined } = {}): { dom: ReactWrapper, title: string } => {
  const dom = mount(
    <PostBranch title={title}>
      {children}
    </ PostBranch>
  )
  return {
    dom,
    title
  }
}

test('<PostBranch /> should render title as a heading', ({ equal, end }) => {
  const title: string = faker.lorem.words()
  const { dom } = setup({ title })
  const heading = dom.find('div > div').first()

  equal(
    heading.text(),
    title,
    `the heading should be '${title}'`
  )
  end()
})

test('<PostBranch /> should render props.children', ({ assert, end }) => {
  const children = [
    <div key={1}>{faker.lorem.word()}</div>,
    <div key={2}>{faker.lorem.word()}</div>,
    <div key={3}>{faker.lorem.word()}</div>
  ]

  const { dom } = setup({ children })
  const renderedChildren = dom.find('div > div').children('div')

  assert(renderedChildren.containsAllMatchingElements(children))
  end()
})
