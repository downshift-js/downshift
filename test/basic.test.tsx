import * as React from 'react';
import Downshift, { ControllerStateAndHelpers } from '../';

interface Props {}

interface State {
    items: Array<any>;
}

export default class App extends React.Component<Props, State> {
    state: State = {
        items: ['apple', 'orange', 'carrot'],
    };

    onChange = (selectedItem: any) => {
        console.log('selectedItem', selectedItem);
    };

    render() {
        const items = this.state.items;

        return (
            <Downshift onChange={this.onChange}>
                {({
                    getButtonProps,
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    selectedItem,
                    highlightedIndex,
                }: ControllerStateAndHelpers) =>
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Favorite color ?',
                            })}
                        />
                        <button
                            {...getButtonProps()}
                        />
                        {isOpen
                            ? <div style={{ border: '1px solid #ccc' }}>
                                  {items
                                      .filter(
                                          (i: any) =>
                                              !inputValue ||
                                              i
                                                  .toLowerCase()
                                                  .includes(
                                                      inputValue.toLowerCase()
                                                  )
                                      )
                                      .map((item: any, index: number) =>
                                          <div
                                              {...getItemProps({ item, index })}
                                              key={item}
                                              style={{
                                                  backgroundColor:
                                                      highlightedIndex === index
                                                          ? 'gray'
                                                          : 'white',
                                                  fontWeight:
                                                      selectedItem === item
                                                          ? 'bold'
                                                          : 'normal',
                                              }}
                                          >
                                              {item}
                                          </div>
                                      )}
                              </div>
                            : null}
                    </div>}
            </Downshift>
        );
    }
}
