// @flow
import * as React from 'react';
import Downshift, { type ControllerStateAndHelpers, type DownshiftInterface } from 'downshift';


type Item = string
const TypedDownShift: DownshiftInterface<Item> = Downshift

type Props = {}

type State = {
    items: Array<Item>;
}

const CustomList = ({ isOpen, children }) => (
    <div className={isOpen ? 'open' : ''}>{children}</div>
)

const CustomListItem = ({ isSelected, children }) => (
    <div className={isSelected ? 'selected' : ''}>{children}</div>
)

export default class App extends React.Component<Props, State> {
    state: State = {
        items: ['apple', 'orange', 'carrot'],
    };

    onChange = (selectedItem: Item) => {
        console.log('selectedItem', selectedItem);
    };

    render() {
        const items = this.state.items;
        const defaultSelectedItem = this.state.items[0];

        return (
            <Downshift defaultSelectedItem={defaultSelectedItem}>
                {({
                    getButtonProps,
                    getItemProps,
                    selectedItem,
                    isOpen,
                }) => (
                    <div style={{ position: 'relative' }}>
                        <div {...getButtonProps()}>{selectedItem}</div>
                        <CustomList isOpen={isOpen}>
                        {items.map((item, index) => (
                            <CustomListItem
                                key={index}
                                {...getItemProps({
                                    item,
                                    index,
                                    isSelected: selectedItem === item
                                })}
                            >
                                {item}
                            </CustomListItem>
                        ))}
                        </CustomList>
                    </div>
                )}
            </Downshift>
        );
    }
}
