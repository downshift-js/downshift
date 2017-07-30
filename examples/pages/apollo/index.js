import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  gql,
  graphql,
} from 'react-apollo'
import Autocomplete from '../../other/react-autocompletely'

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
  // prettier-ignore
  return (
    <Autocomplete onChange={item => alert(item)}>
      <Autocomplete.Input />
      <Autocomplete.Controller>
        {({value, selectedItem, highlightedIndex, isOpen}) => (
          <ApolloAutocompleteMenuWithData
            {...{value, selectedItem, highlightedIndex, isOpen}}
          />
        )}
      </Autocomplete.Controller>
    </Autocomplete>
  )
}

function ApolloAutocompleteMenu({
  data: {allColors, loading},
  selectedItem,
  highlightedIndex,
  isOpen,
}) {
  if (!isOpen) {
    return null
  }
  if (loading) {
    return <div>Loading...</div>
  }
  // prettier-ignore
  return (
    <div>
      {allColors.map(({name: item}, index) => (
        <Autocomplete.Item
          value={item}
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
  ApolloAutocompleteMenu,
)
