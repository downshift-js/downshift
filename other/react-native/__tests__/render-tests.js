/* eslint-disable react/prop-types */
// eslint-disable-next-line import/no-unassigned-import
import {Text, TextInput, View} from 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import TestRenderer from 'react-test-renderer'

import Downshift from '../../../dist/downshift.native.cjs'

test('renders with React Native components', () => {
  const RootView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />
  const childrenSpy = jest.fn(({getRootProps, getInputProps, getItemProps}) => (
    <RootView {...getRootProps({refKey: 'innerRef'})}>
      <TextInput {...getInputProps()} />
      <View>
        <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
        <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
      </View>
    </RootView>
  ))
  const element = <Downshift>{childrenSpy}</Downshift>
  const renderer = TestRenderer.create(element)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: false,
      highlightedIndex: null,
      selectedItem: null,
      inputValue: '',
    }),
  )
  const tree = renderer.toJSON()
  expect(tree).toMatchSnapshot()
})

test('can use children instead of render prop', () => {
  const RootView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />
  const childrenSpy = jest.fn(({getRootProps, getInputProps, getItemProps}) => (
    <RootView {...getRootProps({refKey: 'innerRef'})}>
      <TextInput {...getInputProps()} />
      <View>
        <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
        <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
      </View>
    </RootView>
  ))
  const element = <Downshift>{childrenSpy}</Downshift>
  TestRenderer.create(element)
  expect(childrenSpy).toHaveBeenCalledTimes(1)
})

test('calls onChange when TextInput changes values', () => {
  const onChange = jest.fn()
  const Input = jest.fn(props => <TextInput {...props} />)

  const RootView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />
  const childrenSpy = jest.fn(({getRootProps, getInputProps, getItemProps}) => (
    <RootView {...getRootProps({refKey: 'innerRef'})}>
      <Input {...getInputProps({onChange})} />
      <View>
        <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
        <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
      </View>
    </RootView>
  ))
  const element = <Downshift>{childrenSpy}</Downshift>
  TestRenderer.create(element)
  expect(childrenSpy).toHaveBeenCalledTimes(1)

  const [[firstArg]] = Input.mock.calls
  expect(firstArg).toMatchObject({
    // TODO: We shouldn't need to know about the internals of how we're affecting the TextInput and what props we're supplying.
    // See https://github.com/paypal/downshift/issues/361
    onChangeText: expect.any(Function),
  })
  const fakeEvent = 'foobar'
  firstArg.onChangeText(fakeEvent)

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(fakeEvent)
})

/*
 eslint
  react/prop-types: 0,
  import/extensions: 0,
  import/no-unresolved: 0
 */
