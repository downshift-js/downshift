import 'jest-dom/extend-expect'
import React from 'react'
import ReactDOM from 'react-dom'
import {render, fireEvent} from '@testing-library/react'
import Downshift from '../'

test('will not reset when clicking within the menu', () => {
  class MyMenu extends React.Component {
    el = document.createElement('div')
    componentDidMount() {
      document.body.appendChild(this.el)
    }
    componentWillUnmount() {
      document.body.removeChild(this.el)
    }
    render() {
      return ReactDOM.createPortal(
        <div {...this.props.getMenuProps({'data-testid': 'menu'})}>
          <button data-testid="not-an-item">I am not an item</button>
          <button
            {...this.props.getItemProps({
              item: 'The item',
              'data-testid': 'item',
            })}
          >
            The item
          </button>
        </div>,
        this.el,
      )
    }
  }
  function MyPortalAutocomplete() {
    return (
      <Downshift>
        {({
          getMenuProps,
          getItemProps,
          getToggleButtonProps,
          isOpen,
          selectedItem,
        }) => (
          <div>
            {selectedItem ? (
              <div data-testid="selection">{selectedItem}</div>
            ) : null}
            <button {...getToggleButtonProps({'data-testid': 'button'})}>
              Open Menu
            </button>
            {isOpen ? <MyMenu {...{getMenuProps, getItemProps}} /> : null}
          </div>
        )}
      </Downshift>
    )
  }
  const {getByTestId, queryByTestId} = render(<MyPortalAutocomplete />)
  expect(queryByTestId('menu')).toBeNull()
  getByTestId('button').click()
  expect(getByTestId('menu')).toBeInstanceOf(HTMLElement)

  const notAnItem = getByTestId('not-an-item')

  // Mouse events
  fireEvent.mouseDown(notAnItem)
  notAnItem.focus() // sets document.activeElement
  fireEvent.mouseUp(notAnItem)
  expect(getByTestId('menu')).toBeInstanceOf(HTMLElement)

  // Touch events
  fireEvent.touchStart(notAnItem)
  fireEvent.touchEnd(notAnItem)
  notAnItem.focus() // sets document.activeElement
  expect(getByTestId('menu')).toBeInstanceOf(HTMLElement)

  getByTestId('item').click()
  expect(queryByTestId('menu')).toBeNull()
  expect(getByTestId('selection')).toHaveTextContent('The item')
})
