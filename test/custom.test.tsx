import * as React from 'react'
import Downshift, {ControllerStateAndHelpers} from '../'

type Item = string

interface Props {}

interface State {
  items: Array<Item>
}

const CustomList: React.StatelessComponent<{isOpen: boolean}> = ({
  isOpen,
  children,
}) => <div className={isOpen ? 'open' : ''}>{children}</div>

const CustomListItem: React.StatelessComponent<{isSelected: boolean}> = ({
  isSelected,
  children,
}) => <div className={isSelected ? 'selected' : ''}>{children}</div>

export default class App extends React.Component<Props, State> {
  state: State = {
    items: ['apple', 'orange', 'carrot'],
  }

  onChange = (selectedItem: Item) => {
    console.log('selectedItem', selectedItem)
  }

  render() {
    const items = this.state.items
    const defaultSelectedItem = this.state.items[0]

    return (
      <Downshift defaultSelectedItem={defaultSelectedItem}>
        {({
          getToggleButtonProps,
          getItemProps,
          selectedItem,
          isOpen,
        }: ControllerStateAndHelpers<Item>) => (
          <div style={{position: 'relative'}}>
            <div {...getToggleButtonProps()}>{selectedItem}</div>
            <CustomList isOpen={isOpen}>
              {items.map((item, index) => (
                <CustomListItem
                  key={index}
                  {...getItemProps({
                    item,
                    index,
                    isSelected: selectedItem === item,
                  })}
                >
                  {item}
                </CustomListItem>
              ))}
            </CustomList>
          </div>
        )}
      </Downshift>
    )
  }
}
