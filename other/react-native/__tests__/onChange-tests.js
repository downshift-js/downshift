import {Text, TextInput, View} from 'react-native'
import * as React from 'react'

// Note: test renderer must be required after react-native.
import TestRenderer from 'react-test-renderer'

import Downshift from '../../../dist/downshift.native.cjs'

const RootView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />

test('calls onChange when TextInput changes values', () => {
  const onChange = jest.fn()
  const Input = jest.fn(props => <TextInput {...props} />)

  const element = (
    <Downshift>
      {({getRootProps, getInputProps, getItemProps}) => (
        <RootView {...getRootProps({refKey: 'innerRef'})}>
          <Input {...getInputProps({onChange})} />
          <View>
            <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
            <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
          </View>
        </RootView>
      )}
    </Downshift>
  )
  TestRenderer.create(element)

  const [[firstArg]] = Input.mock.calls
  expect(firstArg).toMatchObject({
    onChange: expect.any(Function),
  })
  const fakeEvent = {nativeEvent: {text: 'foobar'}}
  firstArg.onChange(fakeEvent)

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(fakeEvent)
})

test('calls onChangeText when TextInput changes values', () => {
  const onChangeText = jest.fn()
  const Input = jest.fn(props => <TextInput {...props} />)

  const element = (
    <Downshift>
      {({getRootProps, getInputProps, getItemProps}) => (
        <RootView {...getRootProps({refKey: 'innerRef'})}>
          <Input {...getInputProps({onChangeText})} />
          <View>
            <Text {...getItemProps({item: 'foo', index: 0})}>foo</Text>
            <Text {...getItemProps({item: 'bar', index: 1})}>bar</Text>
          </View>
        </RootView>
      )}
    </Downshift>
  )
  TestRenderer.create(element)

  const [[firstArg]] = Input.mock.calls
  expect(firstArg).toMatchObject({
    onChangeText: expect.any(Function),
  })
  const fakeEvent = 'foobar'
  firstArg.onChangeText(fakeEvent)

  expect(onChangeText).toHaveBeenCalledTimes(1)
  expect(onChangeText).toHaveBeenCalledWith(fakeEvent)
})

/*
 eslint
  react/prop-types: 0,
  import/extensions: 0,
  import/no-unresolved: 0
 */
