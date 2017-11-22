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
    selectedItems: [],
    resetInputOnSelection: true,
  }
  items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']
  changeHandlers = []

  changeHandler = idx => {
    if (!this.changeHandlers[idx]) {
      this.changeHandlers[idx] = selectedColor => {
        const selectedItems = [...this.state.selectedItems]
        selectedItems[idx] = selectedColor
        this.setState({selectedItems})
      }
    }
    return this.changeHandlers[idx]
  }

  addHandler = selectedColor => {
    const selectedItems = [...this.state.selectedItems]
    selectedItems.push(selectedColor)
    this.setState({selectedItems})
  }

  toggleResetInputOnSelection = () => {
    this.setState({resetInputOnSelection: !this.state.resetInputOnSelection})
  }

  render() {
    const notSelectedItems = this.items.filter(
      color => !this.state.selectedItems.includes(color),
    )
    return (
      <div>
        <Div
          css={{
            margin: '50px auto',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <h2>Semi-Controlled Autocomplete List of Items</h2>
          <p>
            {`
              In this example, we're rendering several autocomplete components that allow
              to select several items from a list.
              At the end of the list an autocomplete component allows to add a new item to the list.
            `}
          </p>
          <p>
            This example requires to activate the{' '}
            <code>resetInputOnSelection</code> flag of the{' '}
            <code>breakingChanges</code> component property in order to work
            properly. The checkbox below allows to compare the behaviour with
            the flag <code>true</code> or <code>false</code>.
          </p>
          <Div>
            <input
              type="checkbox"
              checked={this.state.resetInputOnSelection}
              onChange={this.toggleResetInputOnSelection}
            />{' '}
            Activate <code>resetInputOnSelection</code>?
          </Div>
          {this.state.selectedItems.map((selectedColor, idx) => (
            <Div key={selectedColor} display="flex" justifyContent="center">
              <span
                style={{
                  height: '2em',
                  width: '2em',
                  padding: '.3em',
                  borderRadius: '5px',
                  marginRight: '.5em',
                  backgroundColor: selectedColor
                    ? selectedColor
                    : 'transparent',
                }}
              />
              <ControlledAutocomplete
                defaultInputValue={selectedColor}
                selectedItem={selectedColor}
                items={notSelectedItems.concat([selectedColor])}
                onChange={this.changeHandler(idx)}
                breakingChanges={{
                  resetInputOnSelection: this.state.resetInputOnSelection,
                }}
              />
            </Div>
          ))}
          <Div display="flex" justifyContent="center">
            <span
              style={{
                height: '2em',
                width: '2em',
                padding: '.3em',
                borderRadius: '5px',
                marginRight: '.5em',
                backgroundColor: 'transparent',
              }}
            />
            {notSelectedItems.length > 0 ? (
              <ControlledAutocomplete
                selectedItem=""
                items={notSelectedItems}
                onChange={this.addHandler}
                breakingChanges={{
                  resetInputOnSelection: this.state.resetInputOnSelection,
                }}
              />
            ) : (
              <p>All colors have been selected!</p>
            )}
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
