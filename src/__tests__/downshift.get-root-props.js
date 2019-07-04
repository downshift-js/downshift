import React from 'react'
import {render} from '@testing-library/react'
import Downshift from '../'

const MyDiv = ({innerRef, ...rest}) => <div ref={innerRef} {...rest} />

const MyDivWithForwardedRef = React.forwardRef((props, ref) => (
  <div ref={ref} {...props} />
))

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
  const MyComponent = () => <Downshift children={() => null} />
  expect(render(<MyComponent />).container.firstChild).toBe(null)
})

test('returning a composite component without calling getRootProps results in an error', () => {
  const MyComponent = () => <Downshift children={() => <MyDiv />} />
  expect(() => render(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('returning a composite component and calling getRootProps without a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift children={({getRootProps}) => <MyDiv {...getRootProps()} />} />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls[0][0]).toMatchSnapshot()
})

test('returning a DOM element and calling getRootProps with a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => <div {...getRootProps({refKey: 'blah'})} />}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls[0][0]).toMatchSnapshot()
})

test('not applying the ref prop results in an error', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => {
        const {onClick} = getRootProps()
        return <div onClick={onClick} />
      }}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls[0][0]).toMatchSnapshot()
})

test('renders fine when rendering a composite component and applying getRootProps properly', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => (
        <MyDiv {...getRootProps({refKey: 'innerRef'})} />
      )}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})

test('returning a composite component and calling getRootProps without a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => (
        <MyDiv {...getRootProps({}, {suppressRefError: true})} />
      )}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})

test('returning a DOM element and calling getRootProps with a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => (
        <div {...getRootProps({refKey: 'blah'}, {suppressRefError: true})} />
      )}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})

test('not applying the ref prop results in an error does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => {
        const {onClick} = getRootProps({}, {suppressRefError: true})
        return <div onClick={onClick} />
      }}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})

test('renders fine when rendering a composite component and applying getRootProps properly even if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => (
        <MyDiv
          {...getRootProps({refKey: 'innerRef'}, {suppressRefError: true})}
        />
      )}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})

test('renders fine when rendering a composite component and suppressRefError prop is true', () => {
  const MyComponent = () => (
    <Downshift
      suppressRefError
      children={({getRootProps}) => <MyDiv {...getRootProps()} />}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})

test('renders fine when rendering a composite component that uses refs forwarding', () => {
  const MyComponent = () => (
    <Downshift
      children={({getRootProps}) => (
        <MyDivWithForwardedRef {...getRootProps()} />
      )}
    />
  )
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})
