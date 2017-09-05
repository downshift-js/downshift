import * as React from 'react';
import Downshift, { ControllerStateAndHelpers } from '../';

interface Props {}

interface State {
    items: Array<any>;
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

    onChange = (selectedItem: any) => {
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
                }: ControllerStateAndHelpers) => (
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
