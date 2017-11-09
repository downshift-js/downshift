import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

const MyDiv = ({innerRef, ...rest}) => <div ref={innerRef} {...rest} />

const oldError = console.error

beforeEach(() => {
  console.error = jest.fn()
})

afterEach(() => {
  console.error = oldError
})

test('no children provided renders nothing', () => {
  const MyComponent = () => <Downshift />
  expect(mount(<MyComponent />).html()).toBe(null)
})

test('returning null renders nothing', () => {
  const MyComponent = () => <Downshift>{() => null}</Downshift>
  expect(mount(<MyComponent />).html()).toBe(null)
})

test('returning a composite component without calling getRootProps results in an error', () => {
  const MyComponent = () => <Downshift>{() => <MyDiv />}</Downshift>
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('returning a composite component and calling getRootProps without a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift>{({getRootProps}) => <MyDiv {...getRootProps()} />}</Downshift>
  )
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('returning a DOM element and calling getRootProps with a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift>
      {({getRootProps}) => <div {...getRootProps({refKey: 'blah'})} />}
    </Downshift>
  )
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('not applying the ref prop results in an error', () => {
  const MyComponent = () => (
    <Downshift>
      {({getRootProps}) => {
        const {onClick} = getRootProps()
        return <div onClick={onClick} />
      }}
    </Downshift>
  )
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('renders fine when rendering a composite component and applying getRootProps properly', () => {
  const MyComponent = () => (
    <Downshift>
      {({getRootProps}) => <MyDiv {...getRootProps({refKey: 'innerRef'})} />}
    </Downshift>
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('returning a composite component and calling getRootProps without a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift>
      {({getRootProps}) => (
        <MyDiv {...getRootProps({}, {suppressRefError: true})} />
      )}
    </Downshift>
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('returning a DOM element and calling getRootProps with a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift>
      {({getRootProps}) => (
        <div {...getRootProps({refKey: 'blah'}, {suppressRefError: true})} />
      )}
    </Downshift>
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('not applying the ref prop results in an error does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift>
      {({getRootProps}) => {
        const {onClick} = getRootProps({}, {suppressRefError: true})
        return <div onClick={onClick} />
      }}
    </Downshift>
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('renders fine when rendering a composite component and applying getRootProps properly even if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift>
      {({getRootProps}) => (
        <MyDiv
          {...getRootProps({refKey: 'innerRef'}, {suppressRefError: true})}
        />
      )}
    </Downshift>
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

/* eslint no-console:0 */
