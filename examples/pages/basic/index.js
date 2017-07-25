import React from 'react'
import Autocomplete from '../../../src'

export default Examples

function Examples() {
  return (
    <div>
      basic examples
      <BasicAutocomplete />
    </div>
  )
}

function BasicAutocomplete() {
  const items = ['Red', 'Green', 'Blue', 'Orange', 'Purple']
  return (
    <Autocomplete onChange={item => alert(item)}>
      <Autocomplete.Input />
      <Autocomplete.Menu>
        {({inputValue, selectedItem, highlightedIndex}) =>
          // prettier is doing weeeeird things to this
          // prettier-ignore
          items.filter(i => !inputValue || i.toLowerCase().includes(inputValue.toLowerCase()))
            .map((item, index) => (
              <Autocomplete.Item
                item={item}
                index={index}
                key={item}
                style={{
                  backgroundColor: highlightedIndex === index ? 'gray' : 'white',
                  fontWeight: selectedItem === item ? 'bold' : 'normal',
                }}
              >
                {item}
              </Autocomplete.Item>
            ))}
      </Autocomplete.Menu>
    </Autocomplete>
  )
}
