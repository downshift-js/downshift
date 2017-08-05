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
        inputValue,
        getInputProps,
        getItemProps,
        selectedValue,
        highlightedIndex,
        isOpen,
      }) =>
        (<div>
          <input {...getInputProps()} />
          {inputValue
            ? <ApolloAutocompleteMenuWithData
              {...{
                  inputValue,
                  getItemProps,
                  selectedValue,
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
  selectedValue,
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
              fontWeight: selectedValue === item ? 'bold' : 'normal',
            },
          })}
        >
          {item}
        </div>),
      )}
    </div>
  )
}

const SEARCH_COLORS = gql`
  query AllColors($inputValue: String!) {
    allColors(filter: {name_contains: $inputValue}) {
      name
    }
  }
`

const ApolloAutocompleteMenuWithData = graphql(SEARCH_COLORS)(
  ApolloAutocompleteMenu,
)
