import * as React from 'react'

type Item = string

interface Props {}

interface State {
  items: Array<Item>
}

export default class App extends React.Component<Props, State> {
  state: State = {
    items: ['apple', 'orange', 'carrot'],
  }

  onChange = (selectedItem: Item | null) => {
    console.log('selectedItem', selectedItem)
  }

  onUserAction = (changes: StateChangeOptions<Item>) => {
    console.log('type', changes.type)
  }

  render() {
    const items = this.state.items

    return (
      <Downshift onChange={this.onChange}>
        {({
          getToggleButtonProps,
          getInputProps,
          getItemProps,
          getLabelProps,
          getRootProps,
          getMenuProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }) => {
          return (
            <div>
              <div {...getRootProps({}, {})}></div>
              <label
                {...getLabelProps()}
              >
                Hello:
              </label>
              <label {...getLabelProps()}>Hello:</label>
              <input
                {...getInputProps({
                  placeholder: 'Favorite color ?',
                })}
              />
              <button {...getToggleButtonProps()} />
              {isOpen ? (
                <div style={{border: '1px solid #ccc'}} {...getMenuProps()}>
                  {items
                    .filter(
                      i =>
                        !inputValue ||
                        i.toLowerCase().includes(inputValue.toLowerCase()),
                    )
                    .map((item, index: number) => (
                      <div
                        {...getItemProps({item, index})}
                        key={item}
                        style={{
                          backgroundColor:
                            highlightedIndex === index ? 'gray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                        }}
                      >
                        {item}
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          )
        }}
      </Downshift>
    )
  }
}
