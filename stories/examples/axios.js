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
          selectedItem,
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
                    setTimeout(() => {
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
                    }, 300);
                  },
                })}
              />
              {isOpen && (
                <div>
                  {this.state.items.map((item, index) => (
                    <div
                      key={index}
                      {...getItemProps({
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? 'gray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                        },
                      })}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }}
      </Autocomplete>
    )
  }
}
