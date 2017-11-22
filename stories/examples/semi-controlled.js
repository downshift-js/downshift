import React, {Component} from 'react'
import glamorous, {Div} from 'glamorous'
import matchSorter from 'match-sorter'
import Autocomplete from '../../src'

const Input = glamorous.input({
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

class Examples extends Component {
  state = {
    selectedColor: '',
  }
  items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']

  changeHandler = selectedColor => {
    this.setState({selectedColor})
  }

  handleInputChange = event => {
    const {value} = event.target
    if (this.items.includes(value)) {
      this.setState({selectedColor: value})
    }
  }

  render() {
    return (
      <div>
        <Div
          css={{
            margin: '50px auto',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <h2>Semi-Controlled Autocomplete</h2>
          <p>
            {`
              In this example, we're controlling the selected item directly to the downshift
              component. This allows us to control which item is selected from the outside.
              In our example we're passing the selectedItem, while the other props (such as isOpen and inputValue)
              are controlled by downshift itself.
            `}
          </p>
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
            <ControlledAutocomplete
              selectedItem={this.state.selectedColor}
              items={this.items}
              onChange={this.changeHandler}
              onInputChange={this.handleInputChange}
            />
          </Div>
        </Div>
      </div>
    )
  }
}

const Item = glamorous.div(
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
  ({isActive, isSelected}) => ({
    backgroundColor: isActive ? 'lightgrey' : 'white',
    fontWeight: isSelected ? 'bold' : 'normal',
    '&:hover, &:focus': {
      borderColor: '#96c8da',
      boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    },
  }),
)

function ControlledAutocomplete({onInputChange, items, ...rest}) {
  return (
    <Autocomplete {...rest}>
      {({
        getInputProps,
        getItemProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => (
        <div>
          <Input
            {...getInputProps({
              placeholder: 'Favorite color ?',
              onChange: onInputChange,
            })}
          />
          {isOpen && (
            <div style={{border: '1px solid rgba(34,36,38,.15)'}}>
              {(inputValue ? matchSorter(items, inputValue) : items).map(
                (item, index) => (
                  <Item
                    key={item}
                    {...getItemProps({
                      item,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItem === item,
                    })}
                  >
                    {item}
                  </Item>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </Autocomplete>
  )
}
export default Examples
