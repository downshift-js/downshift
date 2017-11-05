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
    inputValue: '',
    isOpen: false,
  }
  items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']

  changeHandler = selectedColor => {
    this.setState({
      selectedColor,
      isOpen: false,
    })
  }

  stateChangeHandler = changes => {
    let {
      selectedItem = this.state.selectedColor,
      isOpen = this.state.isOpen,
      inputValue = this.state.inputValue,
      type,
    } = changes
    isOpen =
      type === Autocomplete.stateChangeTypes.mouseUp
        ? this.state.isOpen
        : isOpen
    this.setState({
      selectedColor: selectedItem,
      isOpen,
      inputValue,
    })
  }

  handleInputChange = event => {
    const {value} = event.target
    const nextState = {inputValue: value}
    if (this.items.includes(value)) {
      nextState.selectedColor = value
    }
    this.setState(nextState)
  }

  clearSelection = () => {
    this.setState({inputValue: '', selectedColor: ''})
  }

  toggleMenu = () => {
    this.setState(({isOpen}) => ({isOpen: !isOpen}))
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
          <h2>Controlled Autocomplete</h2>
          <p>
            {`
              In this example, we're passing controlling props directly to the downshift
              component. This allows us to control which item is selected from the outside.
              In our example we're passing the selectedItem, isOpen, and inputValue and we're
              able to control a bunch of stuff from the outside
            `}
          </p>
          <Div marginBottom={30}>
            <div>
              <Input
                placeholder="Set the value ourselves here"
                onChange={this.handleInputChange}
                value={this.state.inputValue}
                css={{width: 300, maxWidth: '100%', marginBottom: 10}}
              />
            </div>
            <div>
              <button onClick={this.clearSelection}>clear selection</button>
            </div>
            <div>
              <button onClick={this.toggleMenu}>
                toggle menu {this.state.isOpen ? 'closed' : 'open'}
              </button>
            </div>
          </Div>
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
              isOpen={this.state.isOpen}
              inputValue={this.state.inputValue}
              onChange={this.changeHandler}
              onStateChange={this.stateChangeHandler}
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
              {(inputValue
                ? matchSorter(items, inputValue)
                : items
              ).map((item, index) => (
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
              ))}
            </div>
          )}
        </div>
      )}
    </Autocomplete>
  )
}
export default Examples
