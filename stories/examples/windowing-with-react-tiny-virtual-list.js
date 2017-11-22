import React from 'react'
import VirtualList from 'react-tiny-virtual-list'
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
          This is a work in progress See{' '}
          <a href="https://github.com/clauderic/react-tiny-virtual-list/issues/19">
            issue #19 on <pre>react-tiny-virtual-list</pre>
          </a>
        </div>
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
                  <VirtualList
                    width={300}
                    scrollToIndex={highlightedIndex || 0}
                    scrollToAlignment="auto"
                    height={200}
                    itemCount={items.length}
                    itemSize={20}
                    renderItem={({index, style}) => (
                      <div
                        key={items[index].code}
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
