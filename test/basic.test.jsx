// @flow
import React from 'react'
import {
  downshiftFactory,
  type StateChangeOptions,
  type ControllerStateAndHelpers,
  type DownshiftType,
} from 'downshift'

type Item = string
const DownshiftTyped: DownshiftType<Item> = downshiftFactory()

type Props = {}

type State = {
  items: Array<Item>,
}

export default class App extends React.Component<Props, State> {
  state: State = {
    items: ['apple', 'orange', 'carrot'],
  }

  onChange = (selectedItem: Item) => {
    console.log('selectedItem', selectedItem)
  }

  onUserAction = (changes: StateChangeOptions<Item>) => {
    console.log('type', changes.type)
  }

  render() {
    const items = this.state.items

    return (
      <DownshiftTyped onChange={this.onChange}>
        {({
          getButtonProps,
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }: ControllerStateAndHelpers<Item>) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Favorite color ?',
              })}
            />
            <button {...getButtonProps()} />
            {isOpen ? (
              <div style={{border: '1px solid #ccc'}}>
                {items
                  .filter(
                    i =>
                      inputValue === null ||
                      i.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .map((item: Item, index: number) => (
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
        )}
      </DownshiftTyped>
    )
  }
}
