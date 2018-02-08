import React from 'react'
import {Text, TextInput, TouchableOpacity, View} from 'react-native'
import Downshift from '../../dist/downshift.native.cjs'

const MyView = ({innerRef, ...rest}) => <View ref={innerRef} {...rest} />

const BasicAutocomplete = ({items, ...rest}) => (
  <Downshift
    {...rest}
    render={({
      getRootProps,
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex,
    }) => (
      <MyView {...getRootProps({refKey: 'innerRef'})}>
        <TextInput {...getInputProps({placeholder: 'Favorite color ?'})} />
        {isOpen ? (
          <View style={{borderWidth: 1, borderColor: '#ccc'}}>
            {items
              .filter(
                i =>
                  !inputValue ||
                  i.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .map((item, index) => {
                const props = getItemProps({item, index})
                return (
                  <TouchableOpacity {...props} key={item}>
                    <View
                      style={{
                        backgroundColor:
                          highlightedIndex === index ? 'gray' : 'white',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
          </View>
        ) : null}
      </MyView>
    )}
  />
)

export default BasicAutocomplete

/*
 eslint
  react/prop-types: 0,
  import/extensions: 0,
  import/no-unresolved: 0
 */
