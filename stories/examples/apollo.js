import React from 'react'
import {ApolloProvider, Query} from 'react-apollo'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import Downshift from '../../src'

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cj5k7w90bjt2i0122z6v0syvu',
})

const SEARCH_COLORS = gql`
  query AllColors($inputValue: String!) {
    allColors(filter: {name_contains: $inputValue}) {
      name
    }
  }
`

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
    <Downshift onChange={selectedItem => alert(selectedItem)}>
      {({
        inputValue,
        getInputProps,
        getMenuProps,
        getItemProps,
        selectedItem,
        highlightedIndex,
        isOpen,
      }) => (
        <div>
          <input {...getInputProps()} />
          <ApolloAutocompleteMenu
            {...{
              inputValue,
              getMenuProps,
              getItemProps,
              selectedItem,
              highlightedIndex,
              isOpen,
            }}
          />
        </div>
      )}
    </Downshift>
  )
}

function ApolloAutocompleteMenu({
  selectedItem,
  highlightedIndex,
  isOpen,
  getItemProps,
  getMenuProps,
  inputValue,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <Query
      query={SEARCH_COLORS}
      variables={{
        inputValue,
      }}
    >
      {({loading, error, data}) => {
        const allColors = (data && data.allColors) || []

        if (loading) {
          return <div>Loading...</div>
        }

        if (error) {
          return <div>Error! ${error.message}</div>
        }

        return (
          <ul
            {...getMenuProps({
              style: {padding: 0, margin: 0, listStyle: 'none'},
            })}
          >
            {allColors.map(({name: item}, index) => (
              <li
                key={item}
                {...getItemProps({
                  index,
                  item,
                  style: {
                    backgroundColor:
                      highlightedIndex === index ? 'lightgray' : 'white',
                    fontWeight: selectedItem === item ? 'bold' : 'normal',
                  },
                })}
              >
                {item}
              </li>
            ))}
          </ul>
        )
      }}
    </Query>
  )
}

export default Examples
