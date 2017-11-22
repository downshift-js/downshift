import React from 'react'
import {List} from 'react-virtualized'
import matchSorter from 'match-sorter'
import Downshift from '../../src'
import countries from '../countries'

function advancedFilter(theItems, value) {
  return value
    ? matchSorter(theItems, value, {
        keys: ['name', 'code'],
      })
    : theItems
}

// Render your list
class Example extends React.Component {
  state = {items: countries, inputValue: ''}
  handleStateChange = changes => {
    if (changes.hasOwnProperty('inputValue')) {
      const {inputValue} = changes
      this.setState({inputValue, items: advancedFilter(countries, inputValue)})
    }
  }
  render() {
    const {items, inputValue} = this.state
    return (
      <div>
        <h1>Windowing example</h1>
        <div>
          <Downshift
            inputValue={inputValue}
            itemToString={i => (i ? i.name : '')}
            onStateChange={this.handleStateChange}
            itemCount={items.length}
            render={({
              getInputProps,
              getItemProps,
              isOpen,
              selectedItem,
              highlightedIndex,
            }) => (
              <div>
                <input {...getInputProps()} />
                {isOpen ? (
                  <List
                    width={300}
                    scrollToIndex={highlightedIndex || 0}
                    height={200}
                    rowCount={items.length}
                    rowHeight={20}
                    rowRenderer={({key, index, style}) => (
                      <div
                        key={key}
                        {...getItemProps({
                          item: items[index],
                          index,
                          style: {
                            ...style,
                            backgroundColor:
                              highlightedIndex === index ? 'gray' : 'white',
                            fontWeight:
                              selectedItem === items[index] ? 'bold' : 'normal',
                          },
                        })}
                      >
                        {items[index].name}
                      </div>
                    )}
                  />
                ) : null}
              </div>
            )}
          />
        </div>
      </div>
    )
  }
}
export default Example
