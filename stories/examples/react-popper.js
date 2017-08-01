import React, {PureComponent} from 'react'
import {Manager, Target, Popper} from 'react-popper'
import Autocomplete from '../../src'

export default Examples

function Examples() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 8px * 2)',
      }}
    >
      react-popper integration example
      <ReactPopperAutocomplete />
    </div>
  )
}

class ReactPopperAutocomplete extends PureComponent {
  static defaultProps = {
    items: [
      'top',
      'top-start',
      'top-end',
      'bottom-start',
      'bottom',
      'bottom-end',
    ],
  }
  state = {
    selected: 'bottom-start',
  }

  render() {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Manager>
          <Autocomplete
            onChange={selected => this.setState({selected})}
            style={{display: 'inline-block', position: 'relative'}}
          >
            {({
              getInputProps,
              getItemProps,
              value,
              selectedItem,
              highlightedIndex,
              isOpen,
            }) =>
              (<div>
                <Target>
                  <input {...getInputProps()} />
                </Target>
                <div>
                  {isOpen &&
                    <Popper
                      placement={this.state.selected}
                      style={{backgroundColor: 'orange'}}
                    >
                      {this.props.items
                        .filter(
                          i =>
                            !value ||
                            i.toLowerCase().includes(value.toLowerCase())
                        )
                        .map((item, index) =>
                          (<div
                            {...getItemProps({
                              index,
                              value: item,
                            })}
                            key={item}
                            style={{
                              backgroundColor:
                                highlightedIndex === index
                                  ? 'rgba(0, 0, 0, .2)'
                                  : 'transparent',
                              fontWeight:
                                selectedItem === item ? 'bold' : 'normal',
                            }}
                          >
                            {item}
                          </div>)
                        )}
                    </Popper>}
                </div>
              </div>)}
          </Autocomplete>
        </Manager>
      </div>
    )
  }
}
