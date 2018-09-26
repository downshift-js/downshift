import {Text, TextInput, View} from 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import TestRenderer from 'react-test-renderer'

import Downshift from '../../../dist/downshift.native.cjs'

const RootView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />

test('calls onBlur and does not crash when there is no document', () => {
  const Input = jest.fn(props => <TextInput {...props} />)

  const element = (
    <Downshift>
      {({getRootProps, getInputProps, getItemProps}) => (
        <RootView {...getRootProps({refKey: 'innerRef'})}>
          <Input {...getInputProps()} />
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
    onBlur: expect.any(Function),
  })
  const fakeEvent = 'blur'
  firstArg.onBlur(fakeEvent)
})

/*
 eslint
  react/prop-types: 0,
  import/extensions: 0,
  import/no-unresolved: 0
 */
