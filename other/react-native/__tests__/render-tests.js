// eslint-disable-next-line import/no-unassigned-import
import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

import BasicAutocomplete from '../BasicAutocomplete'

test('renders open menus', () => {
  const tree = renderer
    .create(<BasicAutocomplete items={['apple', 'orange', 'carrot']} isOpen />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders input value', () => {
  const tree = renderer
    .create(
      <BasicAutocomplete
        items={['apple', 'orange', 'carrot']}
        isOpen
        inputValue="app"
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders selected items', () => {
  const tree = renderer
    .create(
      <BasicAutocomplete
        items={['apple', 'orange', 'carrot']}
        isOpen
        selectedItem="apple"
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
