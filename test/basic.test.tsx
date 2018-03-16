import * as React from 'react'
import Downshift, {StateChangeOptions, DownshiftInterface} from '../'

type Item = string
const TypedDownShift: DownshiftInterface<Item> = Downshift

interface Props {}

interface State {
  items: Array<Item>
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
      <TypedDownShift onChange={this.onChange}>
        {({
          getButtonProps,
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }) => (
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
        )}
      </TypedDownShift>
    )
  }
}
