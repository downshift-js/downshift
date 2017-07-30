import React, {Component} from 'react'
import axios from 'axios'
import Autocomplete from '../../other/react-autocompletely'

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
      <Autocomplete onChange={item => alert(item)}>
        <Autocomplete.Input
          onChange={event => {
            const inputValue = event.target.value
            if (!inputValue) {
              return
            }
            axios
              .get(baseEndpoint + inputValue)
              .then(response => {
                const items = response.data.items.map(
                  item => `${item.name} (id:${item.id.toString()})`,
                ) // Added ID to make it unique
                this.setState({items})
              })
              .catch(error => {
                console.log(error)
              })
          }}
        />
        <Autocomplete.Controller>
          {({inputValue, selectedItem, highlightedIndex, isOpen}) => {
            // prettier-ignore
            return isOpen && <div>{this.state.items.map((item, index) => (
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
            ))}</div>
          }}
        </Autocomplete.Controller>
      </Autocomplete>
    )
  }
}
