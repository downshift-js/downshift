import React from 'react'
import {render} from 'react-testing-library'
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
  expect(render(<MyComponent />).container.firstChild).toBe(null)
})

test('returning null renders nothing', () => {
  const MyComponent = () => <Downshift render={() => null} />
  expect(render(<MyComponent />).container.firstChild).toBe(null)
})

test('returning a composite component without calling getRootProps results in an error', () => {
  const MyComponent = () => <Downshift render={() => <MyDiv />} />
  expect(() => render(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('returning a composite component and calling getRootProps without a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift render={({getRootProps}) => <MyDiv {...getRootProps()} />} />
  )
  expect(() => render(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('returning a DOM element and calling getRootProps with a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => <div {...getRootProps({refKey: 'blah'})} />}
    />
  )
  expect(() => render(<MyComponent />)).toThrowErrorMatchingSnapshot()
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
  expect(() => render(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('renders fine when rendering a composite component and applying getRootProps properly', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => (
        <MyDiv {...getRootProps({refKey: 'innerRef'})} />
      )}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
})

test('returning a composite component and calling getRootProps without a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => (
        <MyDiv {...getRootProps({}, {suppressRefError: true})} />
      )}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
})

test('returning a DOM element and calling getRootProps with a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      render={({getRootProps}) => (
        <div {...getRootProps({refKey: 'blah'}, {suppressRefError: true})} />
      )}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
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
  expect(() => render(<MyComponent />)).not.toThrow()
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
  expect(() => render(<MyComponent />)).not.toThrow()
})
