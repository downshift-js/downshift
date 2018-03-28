// @flow
import * as React from 'react'
import Downshift, {
  type ControllerStateAndHelpers,
  type DownshiftType,
} from 'downshift' // eslint-disable-line import/no-unresolved

type Item = string
const DownshiftTyped: DownshiftType<Item> = Downshift

type Props = {}

type State = {
  items: Array<Item>,
}

const CustomList = ({
  isOpen,
  children,
}: {
  isOpen: boolean,
  children: React.Node,
}) => <div className={isOpen ? 'open' : ''}>{children}</div>

const CustomListItem = ({
  isSelected,
  children,
}: {
  isSelected: boolean,
  children: React.Node,
}) => <div className={isSelected ? 'selected' : ''}>{children}</div>

export default class App extends React.Component<Props, State> {
  state: State = {
    items: ['apple', 'orange', 'carrot'],
  }

  onChange = (selectedItem: Item) => {
    selectedItem
  }

  render() {
    const items = this.state.items
    const defaultSelectedItem = this.state.items[0]

    return (
      <DownshiftTyped defaultSelectedItem={defaultSelectedItem}>
        {({
          getButtonProps,
          getItemProps,
          selectedItem,
          isOpen,
        }: ControllerStateAndHelpers<Item>) => {
          return (
            <div style={{position: 'relative'}}>
              <div {...getButtonProps()}>{selectedItem}</div>
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
          )
        }}
      </DownshiftTyped>
    )
  }
}
