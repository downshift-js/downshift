// @flow
import React from 'react'
import Downshift, {
  type StateChangeOptions,
  type ControllerStateAndHelpers,
  type DownshiftType,
} from '../typings/downshift.js.flow'

type Item = string
//$FlowFixMe
const DownshiftTyped: DownshiftType<Item> = Downshift

type Props = {}

type State = {
  items: Array<Item>,
}

export default class App extends React.Component<Props, State> {
  state: State = {
    items: ['apple', 'orange', 'carrot'],
  }

  onChange = (selectedItem: Item) => {
    // eslint-disable-next-line no-console
    console.log('selectedItem', selectedItem)
  }

  onUserAction = (changes: StateChangeOptions<Item>) => {
    // eslint-disable-next-line no-console
    console.log('type', changes.type)
  }

  render() {
    const items = this.state.items

    return (
      <DownshiftTyped onChange={this.onChange}>
        {({
          getToggleButtonProps,
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
            <button {...getToggleButtonProps()} />
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
