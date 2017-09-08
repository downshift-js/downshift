import React, {Component} from 'react'
import matchSorter from 'match-sorter'
import Downshift from '../../src'

class Examples extends Component {
  items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']
  state = {
    selectedColor: '',
    inputValue: '',
    itemsToShow: this.items,
  }
  userInputtedValue = ''

  changeHandler = selectedColor => {
    this.setState({selectedColor})
  }

  onUserAction = changes => {
    this.setState(({inputValue, itemsToShow, selectedColor}) => {
      selectedColor = changes.selectedItem || selectedColor
      const isClosingMenu = changes.hasOwnProperty('isOpen') && !changes.isOpen
      if (
        changes.type === Downshift.stateChangeTypes.keyDownEscape &&
        !isClosingMenu
      ) {
        selectedColor = null
      }
      if (changes.hasOwnProperty('inputValue')) {
        if (changes.type === Downshift.stateChangeTypes.keyDownEscape) {
          inputValue = this.userInputtedValue
        } else {
          inputValue = changes.inputValue
          this.userInputtedValue = changes.inputValue
        }
      }
      itemsToShow = this.userInputtedValue
        ? matchSorter(this.items, this.userInputtedValue)
        : this.items
      if (
        changes.hasOwnProperty('highlightedIndex') &&
        (changes.type === Downshift.stateChangeTypes.keyDownArrowUp ||
          changes.type === Downshift.stateChangeTypes.keyDownArrowDown)
      ) {
        inputValue = itemsToShow[changes.highlightedIndex]
      }
      if (isClosingMenu) {
        inputValue = selectedColor
        this.userInputtedValue = selectedColor
      }
      return {inputValue, itemsToShow, selectedColor}
    })
  }

  render() {
    const {inputValue, selectedColor, itemsToShow} = this.state
    return (
      <div>
        <div
          style={{
            margin: '50px auto',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <h2>auto-fill on keydown</h2>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <span
              style={{
                height: '2em',
                width: '2em',
                padding: '.3em',
                borderRadius: '5px',
                marginRight: '.5em',
                backgroundColor: selectedColor ? selectedColor : 'transparent',
              }}
            />
            <BasicAutocomplete
              items={itemsToShow}
              selectedItem={selectedColor}
              inputValue={inputValue}
              onChange={this.changeHandler}
              onUserAction={this.onUserAction}
            />
          </div>
        </div>
      </div>
    )
  }
}

function BasicAutocomplete({
  items,
  inputValue,
  selectedItem,
  onChange,
  onUserAction,
}) {
  return (
    <Downshift
      inputValue={inputValue}
      selectedItem={selectedItem}
      onChange={onChange}
      onUserAction={onUserAction}
    >
      {({getInputProps, getItemProps, highlightedIndex, isOpen}) => (
        <div>
          <input {...getInputProps({placeholder: 'Enter color here'})} />
          {isOpen && (
            <div
              style={{
                maxHeight: 200,
                overflowY: 'scroll',
              }}
            >
              {items.map((item, index) => (
                <div
                  key={item}
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
      )}
    </Downshift>
  )
}
export default Examples
