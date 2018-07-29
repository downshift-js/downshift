import React from 'react'
import {render} from 'react-testing-library'
import Downshift from '../'

const oldError = console.error

beforeEach(() => {
  console.error = jest.fn()
})

afterEach(() => {
  console.error = oldError
})

const Menu = ({innerRef, ...rest}) => <div ref={innerRef} {...rest} />

test('using a composite component and calling getMenuProps without a refKey results in an error', () => {
  const MyComponent = () => (
    <Downshift
      children={({getMenuProps}) => (
        <div>
          <Menu {...getMenuProps()} />
        </div>
      )}
    />
  )
  expect(() => render(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('not applying the ref prop results in an error', () => {
  const MyComponent = () => (
    <Downshift
      children={({getMenuProps}) => {
        getMenuProps()
        return (
          <div>
            <ul />
          </div>
        )
      }}
    />
  )
  expect(() => render(<MyComponent />)).toThrowErrorMatchingSnapshot()
})

test('renders fine when rendering a composite component and applying getMenuProps properly', () => {
  const MyComponent = () => (
    <Downshift
      children={({getMenuProps}) => (
        <div>
          <Menu {...getMenuProps({refKey: 'innerRef'})} />
        </div>
      )}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
})

test('using a composite component and calling getMenuProps without a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getMenuProps}) => (
        <div>
          <Menu {...getMenuProps({}, {suppressRefError: true})} />
        </div>
      )}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
})

test('returning a DOM element and calling getMenuProps with a refKey does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getMenuProps}) => (
        <div>
          <ul {...getMenuProps({refKey: 'blah'}, {suppressRefError: true})} />
        </div>
      )}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
})

test('not applying the ref prop results in an error does not result in an error if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getMenuProps}) => {
        getMenuProps({}, {suppressRefError: true})
        return (
          <div>
            <ul />
          </div>
        )
      }}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
})

test('renders fine when rendering a composite component and applying getMenuProps properly even if suppressRefError is true', () => {
  const MyComponent = () => (
    <Downshift
      children={({getMenuProps}) => (
        <div>
          <Menu
            {...getMenuProps({refKey: 'innerRef'}, {suppressRefError: true})}
          />
        </div>
      )}
    />
  )
  expect(() => render(<MyComponent />)).not.toThrow()
})
