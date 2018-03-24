import React from 'react'
import {render as renderToDOM} from 'react-testing-library'
import Downshift from '../'
import {resetIdCounter} from '../utils'

beforeEach(() => {
  resetIdCounter()
})

test('basic snapshot', () => {
  const {container} = renderDownshift({props: {selectedItem: 'item'}})
  expect(container.firstChild).toMatchSnapshot()
})

test('can override the ids', () => {
  const {container} = renderDownshift({
    props: {
      inputId: 'custom-input-id',
      labelId: 'custom-label-id',
      menuId: 'custom-menu-id',
      getItemId: index => `custom-item-id-${index}`,
    },
  })
  expect(container.firstChild).toMatchSnapshot()
})

test('if aria-label is provided to the menu then aria-labelledby is not applied to the label', () => {
  const customLabel = 'custom menu label'
  const {menu} = renderDownshift({
    menuProps: {'aria-label': customLabel},
  })
  expect(menu.getAttribute('aria-labelledby')).toBeNull()
  expect(menu.getAttribute('aria-label')).toBe(customLabel)
})

function renderDownshift({renderFn, props, menuProps} = {}) {
  function defaultRenderFn({
    getInputProps,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  }) {
    return (
      <div>
        <label data-testid="label" {...getLabelProps()}>
          label
        </label>
        <input data-testid="input" {...getInputProps()} />
        <button data-testid="button" {...getToggleButtonProps()} />
        <ul data-testid="menu" {...getMenuProps(menuProps)}>
          <li data-testid="item-0" {...getItemProps({item: 'item', index: 0})}>
            item
          </li>
        </ul>
      </div>
    )
  }

  let renderArg
  const renderSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return renderFn || defaultRenderFn(controllerArg)
  })
  const utils = renderToDOM(<Downshift {...props} render={renderSpy} />)
  return {
    ...utils,
    renderArg,
    root: utils.queryByTestId('root'),
    input: utils.queryByTestId('input'),
    menu: utils.queryByTestId('menu'),
  }
}
