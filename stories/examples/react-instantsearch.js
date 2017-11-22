import React from 'react'
import {InstantSearch, Highlight} from 'react-instantsearch/dom'
import {connectAutoComplete} from 'react-instantsearch/connectors'
import Downshift from '../../src'

export default Examples

function RawAutoComplete({refine, hits}) {
  return (
    <Downshift
      itemToString={i => (i ? i.name : i)}
      onChange={item => alert(JSON.stringify(item))}
      render={({
        getInputProps,
        getItemProps,
        selectedItem,
        highlightedIndex,
        isOpen,
      }) => (
        <div>
          <input
            {...getInputProps({
              onChange(e) {
                refine(e.target.value)
              },
            })}
          />
          {isOpen && (
            <div>
              {hits.map((item, index) => (
                <div
                  key={item.objectID}
                  {...getItemProps({
                    item,
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    },
                  })}
                >
                  <Highlight attributeName="name" hit={item} tagName="mark" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  )
}

const AutoCompleteWithData = connectAutoComplete(RawAutoComplete)

function Examples() {
  return (
    <InstantSearch
      appId="latency"
      apiKey="6be0576ff61c053d5f9a3225e2a90f76"
      indexName="actors"
    >
      Algolia{' '}
      <a href="https://community.algolia.com/react-instantsearch/">
        React InstantSearch
      </a>{' '}
      example
      <AutoCompleteWithData />
    </InstantSearch>
  )
}
