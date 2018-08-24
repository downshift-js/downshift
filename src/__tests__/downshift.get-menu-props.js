import React from 'react'
import {render} from 'react-testing-library'
import Downshift from '../'

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterEach(() => console.error.mockRestore())

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
  render(<MyComponent />)
  expect(console.error.mock.calls[1][0]).toMatchSnapshot()
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
  render(<MyComponent />)
  expect(console.error.mock.calls[0][0]).toMatchSnapshot()
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
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
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
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
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
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(1)
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
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
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
  render(<MyComponent />)
  expect(console.error.mock.calls).toHaveLength(0)
})

test('getMenuProps mapStateToProps function provides API', () => {
  render(
    <Downshift
      children={({getMenuProps}) => (
        <div>
          <Menu
            {...getMenuProps({refKey: 'innerRef'}, undefined, api => {
              expect(Object.keys(api)).toMatchSnapshot()
            })}
          />
        </div>
      )}
    />,
  )
})

test('getMenuProps mapStateToProps function maps props', () => {
  render(
    <Downshift
      children={({getMenuProps}) => {
        const props = getMenuProps({refKey: 'innerRef'}, undefined, () => {
          return {
            isDownshiftCool: true,
          }
        })

        expect(props.isDownshiftCool).toBe(true)

        return null
      }}
    />,
  )
})
