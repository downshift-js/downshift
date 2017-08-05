import React, {Component} from 'react'
import axios from 'axios'
import Autocomplete from '../../src'

const baseEndpoint = 'https://api.github.com/search/repositories?q='

export default Examples

function Examples() {
  return (
    <div>
      axios examples
      <AxiosAutocomplete />
    </div>
  )
}

class AxiosAutocomplete extends Component {
  constructor(props) {
    super(props)
    this.state = {items: []}
  }

  render() {
    return (
      <Autocomplete>
        {({
          selectedValue,
          getInputProps,
          getItemProps,
          highlightedIndex,
          isOpen,
        }) => {
          return (
            <div>
              <input
                {...getInputProps({
                  onChange: event => {
                    const value = event.target.value
                    if (!value) {
                      return
                    }
                    axios
                      .get(baseEndpoint + value)
                      .then(response => {
                        const items = response.data.items.map(
                          item => `${item.name} (id:${item.id.toString()})`,
                        ) // Added ID to make it unique
                        this.setState({items})
                      })
                      .catch(error => {
                        console.log(error)
                      })
                  },
                })}
              />
              {isOpen &&
                <div>
                  {this.state.items.map((item, index) =>
                    (<div
                      key={index}
                      {...getItemProps({
                        value: item,
                        index,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? 'gray' : 'white',
                          fontWeight:
                            selectedValue === item ? 'bold' : 'normal',
                        },
                      })}
                    >
                      {item}
                    </div>),
                  )}
                </div>}
            </div>
          )
        }}
      </Autocomplete>
    )
  }
}
