import React, {Component} from 'react'
import glamorous, {Div} from 'glamorous'
import Autocomplete from '../../other/react-autocompletely'

class Examples extends Component {
  state = {
    selectedColor: '',
  }

  changeHandler(selectedColor) {
    this.setState({selectedColor})
  }

  render() {
    const items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']
    return (
      <div>
        <Div
          css={{
            margin: '50px auto',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <h2>basic example</h2>
          <Div display="flex" justifyContent="center">
            <span
              style={{
                height: '2em',
                width: '2em',
                padding: '.3em',
                borderRadius: '5px',
                marginRight: '.5em',
                backgroundColor: this.state.selectedColor
                  ? this.state.selectedColor
                  : 'transparent',
              }}
            />
            <BasicAutocomplete
              items={items}
              onChange={this.changeHandler.bind(this)}
            />
          </Div>
        </Div>
      </div>
    )
  }
}

const Item = glamorous(Autocomplete.Item, {
  rootEl: 'div',
  forwardProps: ['index', 'item', 'key'],
})(
  {
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    boxSizing: 'border-box',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({index, item, highlightedIndex, selectedItem}) => ({
    backgroundColor: highlightedIndex === index ? 'lightgrey' : 'white',
    fontWeight: selectedItem === item ? 'bold' : 'normal',
    '&:hover, &:focus': {
      borderColor: '#96c8da',
      boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    },
  }),
)

const Input = glamorous(Autocomplete.Input, {
  rootEl: 'div',
  forwardProps: ['placeholder'],
})({
  fontSize: 14,
  wordWrap: 'break-word',
  lineHeight: '1em',
  outline: 0,
  whiteSpace: 'normal',
  minHeight: '2em',
  background: '#fff',
  display: 'inline-block',
  padding: '.5em 2em .5em 1em',
  color: 'rgba(0,0,0,.87)',
  boxShadow: 'none',
  border: '1px solid rgba(34,36,38,.15)',
  transition: 'box-shadow .1s ease,width .1s ease',
  margin: 0,
  marginBottom: '-2px',
  '&:hover, &focus': {
    borderColor: 'rgba(34,36,38,.35)',
    boxShadow: 'none',
  },
})

function BasicAutocomplete({items, onChange}) {
  return (
    <Autocomplete onChange={onChange}>
      <Input placeholder="Favorite color ?" />
      <Autocomplete.Menu style={{border: '1px solid rgba(34,36,38,.15)'}}>
        {({inputValue, selectedItem, highlightedIndex}) =>
          // prettier is doing weeeeird things to this
          // prettier-ignore
          items.filter(i => !inputValue || i.toLowerCase().includes(inputValue.toLowerCase()))
            .map((item, index) => (
              <Item
                value={item}
                index={index}
                key={item}
                highlightedIndex={highlightedIndex}
                selectedItem={selectedItem}
              >
                {item}
              </Item>
            ))}
      </Autocomplete.Menu>
    </Autocomplete>
  )
}

export default Examples
