# useMultipleSelection to useTagGroup

## Usage examples

Let's consider the following usage examples:

```javascript
import * as React from 'react'
import {render} from 'react-dom'
import {useCombobox, useMultipleSelection} from 'downshift'

const colors = [
  'Black',
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Pink',
  'Orchid',
  'Aqua',
  'Lime',
  'Gray',
  'Brown',
  'Teal',
  'Skyblue',
]

const initialSelectedItems = [colors[0], colors[1]]

function getFilteredItems(selectedItems, inputValue) {
  const lowerCasedInputValue = inputValue.toLowerCase()

  return colors.filter(
    colour =>
      !selectedItems.includes(colour) &&
      colour.toLowerCase().startsWith(lowerCasedInputValue),
  )
}

function DropdownMultipleCombobox() {
  const [inputValue, setInputValue] = React.useState('')
  const [selectedItems, setSelectedItems] = React.useState(initialSelectedItems)
  const items = React.useMemo(
    () => getFilteredItems(selectedItems, inputValue),
    [selectedItems, inputValue],
  )

  const {getSelectedItemProps, getDropdownProps, removeSelectedItem} =
    useMultipleSelection({
      selectedItems,
      onStateChange({selectedItems: newSelectedItems, type}) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems)
            break
          default:
            break
        }
      },
    })
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    clearSelection,
  } = useCombobox({
    items,
    inputValue,
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const {changes, type} = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && {isOpen: true, highlightedIndex: 0}),
          }
        default:
          return changes
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          setSelectedItems([...selectedItems, newSelectedItem])

          break
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue)
          break
        default:
          break
      }
    },
  })
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        justifyContent: 'center',
        marginTop: 100,
        alignSelf: 'center',
      }}
    >
      <label
        style={{
          fontWeight: 'bolder',
          color: selectedItem ? selectedItem : 'black',
        }}
        {...getLabelProps()}
      >
        Choose an element:
      </label>
      <div
        style={{
          display: 'inline-flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '6px',
        }}
      >
        {selectedItems.map(
          function renderSelectedItem(selectedItemForRender, index) {
            return (
              <span
                style={{
                  backgroundColor: 'lightgray',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  borderRadius: '6px',
                }}
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                {selectedItemForRender}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <span
                  style={{padding: '4px', cursor: 'pointer'}}
                  onClick={e => {
                    e.stopPropagation()
                    removeSelectedItem(null)
                  }}
                >
                  &#10005;
                </span>
              </span>
            )
          },
        )}
        <div>
          <input
            style={{padding: '4px'}}
            {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
            data-testid="combobox-input"
          />
          <button
            style={{padding: '4px 8px'}}
            aria-label="toggle menu"
            data-testid="combobox-toggle-button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
          <button
            style={{padding: '4px 8px'}}
            aria-label="clear selection"
            data-testid="clear-button"
            onClick={clearSelection}
          >
            &#10007;
          </button>
        </div>
      </div>
      <ul
        {...getMenuProps()}
        style={{
          listStyle: 'none',
          width: '100%',
          padding: '0',
          margin: '4px 0 0 0',
        }}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              style={{
                padding: '4px',
                backgroundColor: highlightedIndex === index ? '#bde4ff' : null,
              }}
              key={`${item}${index}`}
              {...getItemProps({
                item,
                index,
                'data-testid': `downshift-item-${index}`,
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}

render(<DropdownMultipleCombobox />, document.getElementById('root'))
```

And `useTagGroup`:

```jsx
import * as React from 'react'
import {render} from 'react-dom'
import {useTagGroup, useCombobox} from 'downshift'

const colors = [
  'Black',
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Pink',
  'Orchid',
  'Aqua',
  'Lime',
  'Gray',
  'Brown',
  'Teal',
  'Skyblue',
]

function TagGroup() {
  const initialItems = colors.slice(0, 5)
  const [inputValue, setInputValue] = React.useState('')
  const {
    addItem,
    getTagProps,
    getTagRemoveProps,
    getTagGroupProps,
    items,
    activeIndex,
  } = useTagGroup({initialItems})

  const itemsToAdd = colors.filter(
    color =>
      !items.includes(color) &&
      (!inputValue || color.toLowerCase().includes(inputValue.toLowerCase())),
  )

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: itemsToAdd,
    inputValue,
    onInputValueChange: changes => {
      setInputValue(changes.inputValue)
    },
    onSelectedItemChange(changes) {
      if (changes.selectedItem) {
        addItem(changes.selectedItem)
      }
    },
    selectedItem: null,
    stateReducer(_state, actionAndChanges) {
      const {changes, type} = actionAndChanges

      if (
        changes.selectedItem &&
        type !== useCombobox.stateChangeTypes.InputBlur
      ) {
        return {...changes, inputValue: '', highlightedIndex: 0, isOpen: true}
      }

      return changes
    },
  })

  return (
    <div>
      <div
        {...getTagGroupProps({'aria-label': 'colors example'})}
        className="tag-group"
      >
        {items.map((color, index) => (
          <span
            className={`${index === activeIndex ? 'selected-tag' : ''} tag`}
            key={color}
            {...getTagProps({index, 'aria-label': color})}
          >
            {color}
            <button
              className="tag-remove-button"
              type="button"
              {...getTagRemoveProps({index, 'aria-label': 'remove'})}
            >
              &#10005;
            </button>
          </span>
        ))}
      </div>
      <div className="wrapper">
        <label {...getLabelProps()}>Choose your favorite book:</label>
        <div className="input-wrapper">
          <input
            placeholder="Best book ever"
            className="text-input"
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="toggle-button"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
      </div>
      <ul className="menu" {...getMenuProps()}>
        {isOpen
          ? itemsToAdd.map((item, index) => (
              <li
                className={`menu-item${index === highlightedIndex ? ' highlighted' : ''}`}
                key={item}
                {...getItemProps({item, index})}
              >
                <span>{item}</span>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}

render(<TagGroup />, document.getElementById('root'))
```

## Selection state

For starters:

- both hooks manage state internally
- both hooks accept controlled props
- both hooks return an imperative function to add items to selection

The difference is that one could easly rely on the default internal state of
`useTagGroup` in order to build the multiple seleciton combobox. Consequently,
there's no need for:

```js
const [selectedItems, setSelectedItems] = React.useState(initialSelectedItems)
```

Also, since we rely on `useTagGroup` to manage state on its own, there's no need
to hook an `onStageChange` prop in order to capture the removal state changes
and update `selectedItems` as a result. Consequently, just remove these props:

```js
  selectedItems,
  onStateChange({selectedItems: newSelectedItems, type}) {
    switch (type) {
      case useMultipleSelection.stateChangeTypes
        .SelectedItemKeyDownBackspace:
      case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
      case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
      case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
        setSelectedItems(newSelectedItems)
        break
      default:
        break
    }
  },
```

We also need to make sure that adding items to the selection works, so we still
need to use `addItem` when we detect a combobox selection. Since we don't have a
controlled state anymore, the `onStateChange` from `useCombobox` turns from:

```js
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          setSelectedItems([...selectedItems, newSelectedItem])

          break
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue)
          break
        default:
          break
      }
    },
```

To:

```js
    onSelectedItemChange(changes) {
      if (changes.selectedItem) {
        addItem(changes.selectedItem)
      }
    },
```

Notice that in the `useMultipleSelection` example we use a different
implementation to filter the examples, hence the `setInputValue` on
`useCombobox.stateChangeTypes.InputChange`. Both strategies achieve the same
purpose, but the `useTagGroup` example has a cleaner code. Anyway, choose
whatever you prefer, or any other way to filter the combobox items from the
already selected and the input value.

Notice we keep controlling the `selectedItem` for `useCombobox` since we are
controlling the actual selection, and `useCombobox` only supports single
selection by default.

## JSX

Our tag group is now accessible, and this involves some getter prop function
changes.

### getTagGroupProps

This is new, just use it on the tags container. Looking at the
`useMultipleSelectionCode` that will be the `<div>` after the `<label>`.

### getTagProps

This is equivalent to `getSelectedItemProps`.

### getDropdownProps

This has no equivalent in `useTagGroup`, and it involved a coupling between the
`useMultipleSelection` and `useCombobox` hooks. No need for it now, just use
`getInputProps` without anything extra.

### getTagRemoveProps

In the `useMultipleSelection` example, notice we have an explicit `onClick` prop
that removed the selected item imperatively. With `useTagGroup` we will do it
declaratively by using the `getTagRemoveProps`. Basically, your X icon button
will turn from this:

```javascript
  <span
    style={{padding: '4px', cursor: 'pointer'}}
    onClick={e => {
      e.stopPropagation()
      removeSelectedItem(null)
    }}
  >
```

To this

```javascript
  <button
    style={{padding: '4px', cursor: 'pointer'}}
    type="button"
    {...getTagRemoveProps({index, 'aria-label': 'remove'})}
  >
```

Using a `button` element might be better, but keep in mind that by default we
are removing it from the tab order, since keyboard users can just use
Delete/Backspace when a selected item is focused.

## Wrapping up

We hope that `useTagGroup` provides a way better experience for your users,
since we aimed to make it more accessible, either when using it by itself or
building tag based multiple selection for selects and comboboxes. Feel free to
provide more tips for usage or migrations by opeing a PR / issue in Github in
order to help other users. Thank you!
