import React, {Component} from 'react'
import glamorous, {Div} from 'glamorous'
import Downshift from '../../src'

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

const Dropdown = ({items, selectedItem, onChange}) => (
  <Downshift
    selectedItem={selectedItem}
    onChange={onChange}
    render={({
      isOpen,
      getButtonProps,
      getItemProps,
      highlightedIndex,
      selectedItem: dsSelectedItem,
    }) => (
      <div>
        <button {...getButtonProps()}>
          {selectedItem ? selectedItem : 'Select an item ...'}
        </button>
        <div style={{position: 'relative'}}>
          {isOpen && (
            <div
              style={{
                border: '1px solid rgba(34,36,38,.15)',
                maxHeight: 150,
                width: 200,
                overflowY: 'scroll',
                position: 'absolute',
                left: 0,
                top: 3,
              }}
            >
              {items.map((item, index) => (
                <Item
                  {...getItemProps({
                    item,
                    isActive: highlightedIndex === index,
                    isSelected: dsSelectedItem === item,
                  })}
                  key={item}
                >
                  {item}
                </Item>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  />
)

class Examples extends Component {
  constructor(props) {
    super(props)

    const items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']

    this.state = {
      items,
      selectedItem: items[0],
    }
  }

  handleChange = item => {
    this.setState({
      selectedItem: item,
    })
  }

  render() {
    const {selectedItem, items} = this.state
    return (
      <Div
        css={{
          margin: '50px auto',
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <h2>Dropdown example</h2>
        <Div display="flex" justifyContent="center">
          <Dropdown
            items={items}
            selectedItem={selectedItem}
            onChange={this.handleChange}
          />
        </Div>
      </Div>
    )
  }
}

export default Examples
