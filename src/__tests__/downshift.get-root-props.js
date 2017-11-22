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
  const MyComponent = () => <Downshift render={() => null} />
  expect(mount(<MyComponent />).html()).toBe(null)
})

test('returning a composite component without calling getRootProps results in an error', () => {
  const MyComponent = () => <Downshift render={() => <MyDiv />} />
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('returning a composite component and calling getRootProps without a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift render={({getRootProps}) => <MyDiv {...getRootProps()} />} />
  )
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('returning a DOM element and calling getRootProps with a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => <div {...getRootProps({refKey: 'blah'})} />}
    />
  )
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('not applying the ref prop results in an error', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => {
        const {onClick} = getRootProps()
        return <div onClick={onClick} />
      }}
    />
  )
  expect(() => mount(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('renders fine when rendering a composite component and applying getRootProps properly', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => (
        <MyDiv {...getRootProps({refKey: 'innerRef'})} />
      )}
    />
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('returning a composite component and calling getRootProps without a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => (
        <MyDiv {...getRootProps({}, {suppressRefError: true})} />
      )}
    />
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('returning a DOM element and calling getRootProps with a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => (
        <div {...getRootProps({refKey: 'blah'}, {suppressRefError: true})} />
      )}
    />
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('not applying the ref prop results in an error does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => {
        const {onClick} = getRootProps({}, {suppressRefError: true})
        return <div onClick={onClick} />
      }}
    />
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

test('renders fine when rendering a composite component and applying getRootProps properly even if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => (
        <MyDiv
          {...getRootProps({refKey: 'innerRef'}, {suppressRefError: true})}
        />
      )}
    />
  )
  expect(() => mount(<MyComponent />)).not.toThrow()
})

/* eslint no-console:0 */
