/* eslint-disable react/prop-types */
// eslint-disable-next-line import/no-unassigned-import
import {Text, TextInput, View} from 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import TestRenderer from 'react-test-renderer'

import Downshift from '../../../dist/downshift.native.cjs'

test('renders with React Native components', () => {
  const RootView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />
  const renderSpy = jest.fn(({getRootProps, getInputProps, getItemProps}) => (
    <RootView {...getRootProps({refKey: 'innerRef'})}>
      <TextInput {...getInputProps()} />
      <View>
        <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
        <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
      </View>
    </RootView>
  ))
  const element = <Downshift render={renderSpy} />
  const renderer = TestRenderer.create(element)
  expect(renderSpy).toHaveBeenCalledWith(
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
  const renderSpy = jest.fn(({getRootProps, getInputProps, getItemProps}) => (
    <RootView {...getRootProps({refKey: 'innerRef'})}>
      <TextInput {...getInputProps()} />
      <View>
        <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
        <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
      </View>
    </RootView>
  ))
  const element = <Downshift>{renderSpy}</Downshift>
  TestRenderer.create(element)
  expect(renderSpy).toHaveBeenCalledTimes(1)
})

test('getInputProps composes onChange with onChangeText', () => {
  const onChange = jest.fn()
  const onInput = jest.fn()

  const RootView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />
  const Input = jest.fn(props => <TextInput {...props} />)
  const renderSpy = jest.fn(({getRootProps, getInputProps, getItemProps}) => (
    <RootView {...getRootProps({refKey: 'innerRef'})}>
      <Input {...getInputProps({onChange, onInput})} />
      <View>
        <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
        <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
      </View>
    </RootView>
  ))
  const element = <Downshift render={renderSpy} />
  TestRenderer.create(element)

  expect(Input).toHaveBeenCalledTimes(1)
  const [[firstArg]] = Input.mock.calls
  expect(firstArg).toMatchObject({
    onChangeText: expect.any(Function),
  })
  expect(firstArg.onChange).toBeUndefined()
  const fakeEvent = 'foobar'
  firstArg.onChangeText(fakeEvent)
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(fakeEvent)
  expect(onInput).toHaveBeenCalledTimes(1)
  expect(onInput).toHaveBeenCalledWith(fakeEvent)
})

/*
 eslint
  react/prop-types: 0,
  import/extensions: 0,
  import/no-unresolved: 0
 */
