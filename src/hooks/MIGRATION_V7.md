# Migration from v6 to v7

Since version _7.0.0_ Downshift follows the (ARIA 1.2 guideline for the
combobox)[select-aria]. This brought a series of changes that are considered
breaking, both to the API and the behaviour of downshift's _useSelect_ and
_useCombobox_ hooks. The list of changes, as well as the migration itself, is
detailed below.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [useSelect](#useselect)
  - [Focus](#focus)
  - [HTML Attributes](#html-attributes)
  - [Events](#events)
  - [stateChangeTypes](#statechangetypes)
  - [circularNavigation](#circularnavigation)
- [useCombobox](#usecombobox)
  - [HTML Attributes](#html-attributes-1)
  - [Events](#events-1)
  - [stateChangeTypes](#statechangetypes-1)
  - [circularNavigation](#circularnavigation-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## useSelect

### Focus

Since ARIA 1.2, focus stays on the trigger element at all times.
(Previously)[deprecated-select-aria], it toggled between the trigger and the
menu depending on the open state of the _select_ element. If any of your custom
implementation involved the focus on the menu element, please change it as the
focus stays on the trigger even when the menu is open.

### HTML Attributes

Similar to 1.1, _useSelect_ communicates to the screen reader the currently
highlighted item via the _aria-activedescendant_ attribute. However, since now
the focus is always on the trigger element, this attribute, along with others,
have shifted as shown below:

- getToggleButtonProps additions:
  - role=combobox
  - aria-activedescendant=${highlightedItemId}
  - aria-controls=${menuId}
  - tabindex=0
- getMenuProps removals:
  - aria-activedescendant=${highlightedItemId}
- getItemProps changes:
  - aria-selected=${item === selectedItem} - now the item that is selected
    received _aria-selected=true_, the rest receive it as false. Previously, the
    highlighted item was marked with _aria-selected=true_.

### Events

Event changes occured because of the focus shift, as well as new accessibility
pattern recommendantions.

- getToggleButtonProps additions:

  - _ArrowDown+Alt_: opens the menu without any item highlighted.
  - _ArrowUp+Alt_: closes the menu and selects the highlighted item.
  - _End_: highlights the last item and opens the menu if closed.
  - _Home_: highlights the first item and opens the menu if closed.
  - _PageUp_: if menu is open, moves highlight by 10 positions to the start.
  - _PageDown_: if menu is open, moves highlight by 10 positions to the end.
  - _${characterKey}_: always opens the menu if closed, highlights the item
    starting with that key (same behaviour as before when the menu is opened).
  - _Enter_: if menu is open, closes the menu and selects the highlighted item.
  - _SpaceBar_: if menu is open, closes the menu and selects the highlighted
    item. If the space is part of a search query, it will be added to the search
    query instead.
  - _Escape_: closes the menu if open, without selecting anything.
  - _Tab_ or any other _Blur_: closes the menu if open, selects highlighted
    item, focus moves naturally.
  - _ArrowUp_: moves highlight one position up. _Shift_ modifier is not
    supported anymore.
  - _ArrowDown_: moves highlight one position down. _Shift_ modifier is not
    supported anymore.

- getToggleButtonProps changes:

  - _ArrowUp_: if there is an item selected, opens the menu with that item
    highlighted, not with the -1 offset as it did in v6 (ARIA 1.1).
  - _ArrowDown_: if there is an item selected, opens the menu with that item
    highlighted, not with the +1 offset as it did in v6 (ARIA 1.1).

- getMenuProps removals:
  - _ArrowUp_, _ArrowDown_, _End_, _Home_, _Enter_, _Escape_, _SpaceBar_, _Tab_.

### stateChangeTypes

As a consequence of the [event changes](#events), the _stateChangeTypes_
received in the _stateReducer_ and _on${statePropery}Change_ received the
following modifications:

- MenuKeyDownArrowDown -> ToggleButtonKeyDownArrowDown
- MenuKeyDownArrowUp -> ToggleButtonKeyDownArrowUp
- MenuKeyDownEscape -> ToggleButtonKeyDownEscape
- MenuKeyDownHome -> ToggleButtonKeyDownHome
- MenuKeyDownEnd -> ToggleButtonKeyDownEnd
- MenuKeyDownEnter -> ToggleButtonKeyDownEnter
- MenuKeyDownSpaceButton -> ToggleButtonKeyDownSpaceButton
- MenuKeyDownCharacter -> ToggleButtonKeyDownCharacter
- MenuBlur -> ToggleButtonBlur
- ToggleButtonKeyDownPageUp: new state change type.
- ToggleButtonKeyDownPageDown: new state change type.

Please change your reducer / onChange code accordingly. For instance:

```js
function stateReducer(state, actionAndChanges) {
  const {changes, type} = actionAndChanges
  switch (type) {
    case useSelect.stateChangeTypes.MenuKeyDownEnter:
    case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true, // keep the menu open after selection.
      }
    default:
      return changes
  }
}
```

Becomes:

```js
function stateReducer(state, actionAndChanges) {
  const {changes, type} = actionAndChanges
  switch (type) {
    case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
    case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true, // keep the menu open after selection.
      }
    default:
      return changes
  }
}
```

### circularNavigation

The prop _circularNavigation_ has been removed. Navigation inside the menu is
standard and non-circular. If you wish to make it circular, use the
_stateReducer_:

```js
function stateReducer(state, actionAndChanges) {
  const {changes, type} = actionAndChanges
  switch (type) {
    case useSelect.stateChangeTypes.ToggleButtonKeyDownArrowDown:
      if (state.highlightedIndex === items.length - 1) {
        return {...changes, highlightedIndex: state.highlightedIndex}
      } else {
        return changes
      }
    case useSelect.stateChangeTypes.ToggleButtonKeyDownArrowUp:
      if (state.highlightedIndex === 0) {
        return {...changes, highlightedIndex: state.highlightedIndex}
      } else {
        return changes
      }
    default:
      return changes
  }
}
```

## useCombobox

### HTML Attributes

The biggest change is that the input wrapper element does not receive the
combobox role attributes anymore. Every attribute that belonged to the wrapper
element are now added on the input element. The changes are as follows:

- getComboboxProps has been removed.
- getInputProps additions:
  - role=combobox
  - aria-expanded=${isOpen}
- getToggleButtonProps additions:
  - aria-controls=${menuId}
  - aria-expanded=${isOpen}

### Events

As a result of the 1.2 pattern, there are a few event handling changes detailed
below.

- getInputProps additions:
  - _ArrowDown+Alt_: opens the menu without any item highlighted.
  - _ArrowUp+Alt_: closes the menu and selects the highlighted item.
  - _PageUp_: if menu is open, moves highlight by 10 positions to the start.
  - _PageDown_: if menu is open, moves highlight by 10 positions to the end.
  - _Focus_: if menu is closed, opens the menu.

### stateChangeTypes

As a consequence of the [event changes](#events), the _stateChangeTypes_
received in the _stateReducer_ and _on${statePropery}Change_ received the
following additions:

- InputKeyDownPageUp
- InputKeyDownPageDown
- InputFocus

You don't need to change your reducer if you want to keep the 1.2 functionality
provided by default. However, if you want to keep the menu closed when the input
gets focus, you can do:

```js
function stateReducer(state, actionAndChanges) {
  const {changes, type} = actionAndChanges
  switch (type) {
    case useCombobox.stateChangeTypes.InputFocus:
      return {
        ...changes,
        isOpen: false, // keep the menu open after selection.
      }
    default:
      return changes
  }
}
```

### circularNavigation

The prop _circularNavigation_ has been removed. Navigation inside the menu is
standard and circular. If you wish to make it non-circular, use the
_stateReducer_:

```js
function stateReducer(state, actionAndChanges) {
  const {changes, type} = actionAndChanges
  switch (type) {
    case useCombobox.stateChangeTypes.ToggleButtonKeyDownArrowDown:
      if (state.highlightedIndex === items.length - 1) {
        return {...changes, highlightedIndex: state.highlightedIndex}
      } else {
        return changes
      }
    case useCombobox.stateChangeTypes.ToggleButtonKeyDownArrowUp:
      if (state.highlightedIndex === 0) {
        return {...changes, highlightedIndex: state.highlightedIndex}
      } else {
        return changes
      }
    default:
      return changes
  }
}
```

[combobox-aria]: https://w3c.github.io/aria-practices/#combobox
[select-aria-example]:
  https://w3c.github.io/aria-practices/examples/combobox/combobox-select-only.html
[combobox-aria-example]:
  https://w3c.github.io/aria-practices/examples/combobox/combobox-autocomplete-both.html
[deprecated-select-aria]:
  https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/listbox/listbox-collapsible.html
