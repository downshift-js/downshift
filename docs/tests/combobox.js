import * as React from 'react'
import Downshift from '../../src'

class Combobox extends React.Component {
  state = {
    selectedColor: '',
  }

  handleChange = selectedColor => {
    this.setState({selectedColor})
  }

  render() {
    const items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']
    return (
      <div
        style={{
          marginTop: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
        <Downshift onChange={this.handleChange}>
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            getLabelProps,
            getToggleButtonProps,
            highlightedIndex,
            inputValue,
            isOpen,
            selectedItem,
            clearSelection,
          }) => (
            <div>
              <label {...getLabelProps()}>Color</label>
              <input
                {...getInputProps({
                  placeholder: 'Enter color here',
                  'data-testid': 'combobox-input',
                })}
              />
              <button
                {...getToggleButtonProps({'data-testid': 'toggle-button'})}
              >
                Toggle
              </button>
              <button data-testid="clear-button" onClick={clearSelection}>
                clear
              </button>
              <ul
                {...getMenuProps({
                  isOpen,
                })}
              >
                {isOpen &&
                  (inputValue
                    ? items.filter(i =>
                        i.toLowerCase().includes(inputValue.toLowerCase()),
                      )
                    : items
                  ).map((item, index) => (
                    <li
                      key={item}
                      {...getItemProps({
                        'data-testid': `downshift-item-${index}`,
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? 'lightgray' : null,
                          fontWeight: selectedItem === item ? 'bold' : null,
                        },
                      })}
                    >
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </Downshift>
      </div>
    )
  }
}

export default Combobox

// downshift takes care of the label for us
/* eslint jsx-a11y/label-has-for:0 */
