import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {render, fireEvent, screen} from '@testing-library/react'
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
  render(<MyPortalAutocomplete />)
  expect(screen.queryByTestId('menu')).toBeNull()
  screen.getByTestId('button').click()
  expect(screen.getByTestId('menu')).toBeInstanceOf(HTMLElement)

  const notAnItem = screen.getByTestId('not-an-item')

  // Mouse events
  fireEvent.mouseDown(notAnItem)
  notAnItem.focus() // sets document.activeElement
  fireEvent.mouseUp(notAnItem)
  expect(screen.getByTestId('menu')).toBeInstanceOf(HTMLElement)

  // Touch events
  fireEvent.touchStart(notAnItem)
  fireEvent.touchEnd(notAnItem)
  notAnItem.focus() // sets document.activeElement
  expect(screen.getByTestId('menu')).toBeInstanceOf(HTMLElement)

  screen.getByTestId('item').click()
  expect(screen.queryByTestId('menu')).toBeNull()
  expect(screen.getByTestId('selection')).toHaveTextContent('The item')
})
