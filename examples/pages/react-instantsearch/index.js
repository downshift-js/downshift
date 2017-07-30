import React from 'react'
import {InstantSearch, Highlight} from 'react-instantsearch/dom'
import {connectAutoComplete} from 'react-instantsearch/connectors'
import Autocomplete from '../../other/react-autocompletely'

export default Examples

function RawAutoComplete({refine, hits}) {
  return (
    <Autocomplete onChange={item => alert(JSON.stringify(item))}>
      <Autocomplete.Input onChange={e => refine(e.target.value)} />
      <Autocomplete.Controller>
        {({selectedItem, highlightedIndex, isOpen}) =>
          isOpen &&
          <div>
            {hits.map((item, index) =>
              (<Autocomplete.Item
                value={item}
                index={index}
                key={item.objectID}
                style={{
                  backgroundColor:
                    highlightedIndex === index ? 'gray' : 'white',
                  fontWeight: selectedItem === item ? 'bold' : 'normal',
                }}
              >
                <Highlight attributeName="name" hit={item} tagName="mark" />
              </Autocomplete.Item>),
            )}
          </div>}
      </Autocomplete.Controller>
    </Autocomplete>
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
