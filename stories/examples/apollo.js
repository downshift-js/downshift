import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  gql,
  graphql,
} from 'react-apollo'
import Autocomplete from '../../src'

export default Examples

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj5k7w90bjt2i0122z6v0syvu',
})

const client = new ApolloClient({
  networkInterface,
})

function Examples() {
  return (
    <ApolloProvider client={client}>
      <div>
        apollo examples
        <ApolloAutocomplete />
      </div>
    </ApolloProvider>
  )
}

function ApolloAutocomplete() {
  return (
    <Autocomplete onChange={item => alert(item)}>
      {({
        value,
        getInputProps,
        getItemProps,
        selectedItem,
        highlightedIndex,
        isOpen,
      }) =>
        (<div>
          <input {...getInputProps()} />
          {value
            ? <ApolloAutocompleteMenuWithData
              {...{
                  value,
                  getItemProps,
                  selectedItem,
                  highlightedIndex,
                  isOpen,
                }}
              />
            : null}
        </div>)}
    </Autocomplete>
  )
}

function ApolloAutocompleteMenu({
  data: {allColors = [], loading} = {},
  selectedItem,
  highlightedIndex,
  isOpen,
  getItemProps,
}) {
  if (!isOpen) {
    return null
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      {allColors.map(({name: item}, index) =>
        (<div
          key={item}
          {...getItemProps({
            value: item,
            index,
            style: {
              backgroundColor: highlightedIndex === index ? 'gray' : 'white',
              fontWeight: selectedItem === item ? 'bold' : 'normal',
            },
          })}
        >
          {item}
        </div>)
      )}
    </div>
  )
}

const SEARCH_COLORS = gql`
  query AllColors($value: String!) {
    allColors(filter: {name_contains: $value}) {
      name
    }
  }
`

const ApolloAutocompleteMenuWithData = graphql(SEARCH_COLORS)(
  ApolloAutocompleteMenu
)
