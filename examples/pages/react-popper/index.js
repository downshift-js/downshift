import React, { PureComponent } from "react";
import { Manager, Target, Popper } from "react-popper";
import Autocomplete from "../../other/react-autocompletely";

export default Examples;

function Examples() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 8px * 2)"
      }}
    >
      react-popper integration example
      <ReactPopperAutocomplete />
    </div>
  );
}

class ReactPopperAutocomplete extends PureComponent {
  static defaultProps = {
    items: [
      "top",
      "top-start",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ]
  };
  state = {
    selected: "bottom-start"
  };

  render() {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Manager>
          <Autocomplete
            onChange={selected => this.setState({ selected })}
            style={{ display: "inline-block", position: "relative" }}
          >
            <Target>
              <Autocomplete.Input />
            </Target>
            <Autocomplete.Menu>
              {({ inputValue, selectedItem, highlightedIndex }) =>
                (<Popper
                  placement={this.state.selected}
                  style={{ backgroundColor: "orange" }}
                >
                  {this.props.items
                    .filter(
                      i =>
                        !inputValue ||
                        i.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((item, index) =>
                      (<Autocomplete.Item
                        value={item}
                        index={index}
                        key={item}
                        style={{
                          backgroundColor:
                            highlightedIndex === index
                              ? "rgba(0, 0, 0, .2)"
                              : "transparent",
                          fontWeight: selectedItem === item ? "bold" : "normal"
                        }}
                      >
                        {item}
                      </Autocomplete.Item>)
                    )}
                </Popper>)}
            </Autocomplete.Menu>
          </Autocomplete>
        </Manager>
      </div>
    );
  }
}
