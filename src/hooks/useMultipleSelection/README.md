# useMultipleSelection

## The problem

You have a custom `select` or a `combobox` in your applications which performs a
multiple selection. You want want the whole experience to be accessible,
including adding and removing items from selection, navigating between the items
and back to the dropdown. You also want this solution to be simple to use and
flexible so you can tailor it further to your specific needs.

## This solution

`useMultipleSelection` is a React hook that manages all the stateful logic
needed to make the multiple selection dropdown functional and accessible. It
returns a set of props that are meant to be called and their results
destructured on the dropdown's elements that involve the multiple selection
experience: the dropdown main element itself, which can be either an `input` (if
you are building a `combobox`) or a `button` (if you are building a `select`),
and the selected items. The props are similar to the ones provided by vanilla
`Downshift` to the children render prop.

These props are called getter props and their return values are destructured as
a set of ARIA attributes and event listeners. Together with the action props and
state props, they create all the stateful logic needed for the dropdown to
become accessible. Every functionality needed should be provided out-of-the-box:
arrow navigation between dropdown and items, navigation between the items
themselves, removing and adding items, and also helpful `aria-live` messages
such as when an item has been removed from selection.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Basic Props](#basic-props)
  - [itemToString](#itemtostring)
  - [onSelectedItemsChange](#onselecteditemschange)
  - [stateReducer](#statereducer)
- [Advanced Props](#advanced-props)
  - [keyNavigationNext](#keynavigationnext)
  - [keyNavigationPrevious](#keynavigationprevious)
  - [initialSelectedItems](#initialselecteditems)
  - [initialActiveIndex](#initialactiveindex)
  - [defaultSelectedItems](#defaultselecteditems)
  - [defaultActiveIndex](#defaultactiveindex)
  - [getA11yRemovalMessage](#geta11yremovalmessage)
  - [onActiveIndexChange](#onactiveindexchange)
  - [onStateChange](#onstatechange)
  - [activeIndex](#activeindex)
  - [selectedItems](#selecteditems)
  - [environment](#environment)
- [stateChangeTypes](#statechangetypes)
- [Control Props](#control-props)
- [Returned props](#returned-props)
  - [prop getters](#prop-getters)
  - [actions](#actions)
  - [state](#state)
- [Event Handlers](#event-handlers)
  - [Default handlers](#default-handlers)
  - [Customizing Handlers](#customizing-handlers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

> [Try it out in the browser][sandbox-example]

```javascript
import * as React from 'react'
import {render} from 'react-dom'
import {useCombobox} from 'downshift'
// items = ['Neptunium', 'Plutonium', ...]
import {
  items,
  menuStyles,
  comboboxWrapperStyles,
  comboboxStyles,
  selectedItemStyles,
  selectedItemIconStyles,
} from './utils'

const DropdownMultipleCombobox = () => {
  const [inputValue, setInputValue] = useState('')
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({initialSelectedItems: [items[0], items[1]]})
  const getFilteredItems = items =>
    items.filter(
      item =>
        selectedItems.indexOf(item) < 0 &&
        item.toLowerCase().startsWith(inputValue.toLowerCase()),
    )
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    inputValue,
    items: getFilteredItems(items),
    onStateChange: ({inputValue, type, selectedItem}) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue)

          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
            addSelectedItem(selectedItem)
            selectItem(null)
          }

          break
        default:
          break
      }
    },
  })

  return (
    <div>
      <label {...getLabelProps()}>Choose some elements:</label>
      <div style={comboboxWrapperStyles}>
        {selectedItems.map((selectedItem, index) => (
          <span
            style={selectedItemStyles}
            key={`selected-item-${index}`}
            {...getSelectedItemProps({selectedItem, index})}
          >
            {selectedItem}
            <span
              style={selectedItemIconStyles}
              onClick={() => removeSelectedItem(selectedItem)}
            >
              &#10005;
            </span>
          </span>
        ))}
        <div style={comboboxStyles} {...getComboboxProps()}>
          <input
            {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
          />
          <button {...getToggleButtonProps()} aria-label={'toggle menu'}>
            &#8595;
          </button>
        </div>
      </div>
      <ul {...getMenuProps()} style={menuMultipleStlyes}>
        {isOpen &&
          getFilteredItems(items).map((item, index) => (
            <li
              style={
                highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
              }
              key={`${item}${index}`}
              {...getItemProps({item, index})}
            >
              {item}
            </li>
          ))}
      </ul>
    <div/>
  )
}

render(<DropdownMultipleCombobox />, document.getElementById('root'))
```

The equivalent example with `useSelect` is [here][select-sandbox-example].

## Basic Props

This is the list of props that you should probably know about. There are some
[advanced props](#advanced-props) below as well.

### itemToString

> `function(item: any)` | defaults to: `i => (i == null ? '' : String(i))`

If your items are stored as, say, objects instead of strings, downshift still
needs a string representation for each one. This is required for accessibility
messages (e.g., after removing a selection).

### onSelectedItemsChange

> `function(changes: object)` | optional, no useful default

Called each time the selected items array changes. Especially useful when items
are removed, as there are many ways to do that: `Backspace` from dropdown,
`Backspace` or `Delete` while focus is the item, executing `removeSelectedItem`
when clicking an associated `X` icon for the item.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `selectedItems`
  property with the new array value. This also has a `type` property which you
  can learn more about in the [`stateChangeTypes`](#statechangetypes) section.
  This property will be part of the actions that can trigger an `selectedItems`
  change, for example `useSelect.stateChangeTypes.DropdownKeyDownBackspace`.

### stateReducer

> `function(state: object, actionAndChanges: object)` | optional

**🚨 This is a really handy power feature 🚨**

This function will be called each time `useMultipleSelection` sets its internal
state (or calls your `onStateChange` handler for control props). It allows you
to modify the state change that will take place which can give you fine grain
control over how the component interacts with user updates. It gives you the
current state and the state that will be set, and you return the state that you
want to set.

- `state`: The full current state of downshift.
- `actionAndChanges`: Object that contains the action `type`, props needed to
  return a new state based on that type and the changes suggested by the
  Downshift default reducer. About the `type` property you can learn more about
  in the [`stateChangeTypes`](#statechangetypes) section.

```javascript
import {useMultipleSelection} from 'downshift'
import {items} from './utils'

const {getDropdownProps, getSelectedItemProps, ...rest} = useMultipleSelection({
  initialSelectedItems: [items[0], items[1]],
  stateReducer,
})

function stateReducer(state, actionAndChanges) {
  const {type, changes} = actionAndChanges
  // this adds focus to the dropdown when item is removed by keyboard action.
  switch (type) {
    case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
    case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
      return {
        ...changes,
        activeIndex: -1, // the focus will move to the input/button
      }
    default:
      return changes // otherwise business as usual.
  }
}
```

> NOTE: This is only called when state actually changes. You should not attempt
> use this to handle events. If you wish to handle events, put your event
> handlers directly on the elements (make sure to use the prop getters though!
> For example `<button onBlur={handleBlur} />` should be
> `<button {...getToggleButtonProps({onBlur: handleBlur})} />`). Also, your
> reducer function should be "pure." This means it should do nothing other than
> return the state changes you want to have happen.

## Advanced Props

### keyNavigationNext

> `string` | defaults to `ArrowRight`

The navigation key that increments `activeIndex` and moves focus to the selected
item whose index corresponds to the new value. For a `RTL` scenario, a common
overriden value could be `ArrowLeft`. In some scenarios it can be `ArrowDown`.
It mostly depends on the UI the user is presented with.

### keyNavigationPrevious

> `string` | defaults to `ArrowLeft`

The navigation key that decrements `activeIndex` and moves focus to the selected
item whose index corresponds to the new value. Also moves focus from `dropdown`
to item with the last index. For a `RTL` scenario, a common overriden value
could be `ArrowRight`. In some scenarios it can be `ArrowUp`. It mostly depends
on the UI the user is presented with.

### initialSelectedItems

> `any[]` | defaults to `[]`

Pass an initial array of items that are considered to be selected.

### initialActiveIndex

> `number` | defaults to `-1`

Pass a number that sets the index of the focused / active selected item when
downshift is initialized.

### defaultSelectedItems

> `any[]` | defaults to `[]`

Pass an array of items that are going to be used when downshift is reset.

### defaultActiveIndex

> `number` | defaults to `-1`

Pass a number that sets the index of the focused / active selected item when
downshift is reset.

### getA11yRemovalMessage

> `function({/* see below */})` | default messages provided in English

This function is similar to the `getA11yStatusMessage` and
`getA11ySelectionMessage` from `useSelect` and `useCombobox` but it is
generating a message when an item is removed.

A default `getA11yRemovalMessage` function is provided. It is called when an
item is removed and the size of `selectedItems` decreases. When an item is
removed, the message is a removal related one, narrating
"`itemToString(removedItem)` has been removed".

The object you are passed to generate your status message for
`getA11yRemovalMessage` has the following properties:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property              | type            | description                                                                                  |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `resultCount`         | `number`        | The count of selected items in the list.                                                     |
| `itemToString`        | `function(any)` | The `itemToString` function (see props) for getting the string value from one of the options |
| `removedSelectedItem` | `any`           | The value of the currently removed item                                                      |
| `activeSelectedItem`  | `any`           | The value of the currently active item                                                       |
| `activeIndex`         | `number`        | The index of the currently active item.                                                      |

### onActiveIndexChange

> `function(changes: object)` | optional, no useful default

Called each time the index of the active item changes. When an item becomes
active, it receives focus, so it can receive keyboard events. To change
`activeIndex` you can either click on the item or use navigation keys between
the items and the dropdown.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `activeIndex` property
  with the new value. This also has a `type` property which you can learn more
  about in the [`stateChangeTypes`](#statechangetypes) section. This property
  will be part of the actions that can trigger a `activeIndex` change, for
  example `useSelect.stateChangeTypes.ItemClick`.

### onStateChange

> `function(changes: object)` | optional, no useful default

This function is called anytime the internal state changes. This can be useful
if you're using downshift as a "controlled" component, where you manage some or
all of the state (e.g. selectedItems and activeIndex) and then pass it as props,
rather than letting downshift control all its state itself.

- `changes`: These are the properties that actually have changed since the last
  state change. This also has a `type` property which you can learn more about
  in the [`stateChangeTypes`](#statechangetypes) section.

> Tip: This function will be called any time _any_ state is changed. The best
> way to determine whether any particular state was changed, you can use
> `changes.hasOwnProperty('propName')` or use the `on[statePropKey]Change` props
> described above.

> NOTE: This is only called when state actually changes. You should not attempt
> to use this to handle events. If you wish handle events, put your event
> handlers directly on the elements (make sure to use the prop getters though!
> For example: `<button onBlur={handleBlur} />` should be
> `<button {...getDropdownProps({onBlur: handleBlur})} />`).

### activeIndex

> `number` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The index of the item that should be active and focused.

### selectedItems

> `any[]` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The items that are considered selected at the time.

### environment

> `window` | defaults to `window`

This prop is only useful if you're rendering downshift within a different
`window` context from where your JavaScript is running; for example, an iframe
or a shadow-root. If the given context is lacking `document` and/or
`add|removeEventListener` on its prototype (as is the case for a shadow-root)
then you will need to pass in a custom object that is able to provide
[access to these properties](https://gist.github.com/Rendez/1dd55882e9b850dd3990feefc9d6e177)
for downshift.

## stateChangeTypes

There are a few props that expose changes to state
([`onStateChange`](#onstatechange) and [`stateReducer`](#statereducer)). For you
to make the most of these APIs, it's important for you to understand why state
is being changed. To accomplish this, there's a `type` property on the `changes`
object you get. This `type` corresponds to a `stateChangeTypes` property.

The list of all possible values this `type` property can take is defined in
[this file][state-change-file] and is as follows:

- `useMultipleSelection.stateChangeTypes.SelectedItemClick`
- `useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete`
- `useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace`
- `useMultipleSelection.stateChangeTypes.SelectedItemKeyDownNavigationNext`
- `useMultipleSelection.stateChangeTypes.SelectedItemKeyDownNavigationPrevious`
- `useMultipleSelection.stateChangeTypes.DropdownKeyDownNavigationPrevious`
- `useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace`
- `useMultipleSelection.stateChangeTypes.DropdownClick`
- `useMultipleSelection.stateChangeTypes.FunctionAddSelectedItem`
- `useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem`
- `useMultipleSelection.stateChangeTypes.FunctionSetSelectedItems`
- `useMultipleSelection.stateChangeTypes.FunctionSetActiveIndex`
- `useMultipleSelection.stateChangeTypes.FunctionReset`

See [`stateReducer`](#statereducer) for a concrete example on how to use the
`type` property.

## Control Props

Downshift manages its own state internally and calls your
`onSelectedItemsChange`, `onActiveIndexChange` and `onStateChange` handlers with
any relevant changes. The state that downshift manages includes: `selectedItems`
and `activeIndex`. Returned action function (read more below) can be used to
manipulate this state and can likely support many of your use cases.

However, if more control is needed, you can pass any of these pieces of state as
a prop (as indicated above) and that state becomes controlled. As soon as
`this.props[statePropKey] !== undefined`, internally, `downshift` will determine
its state based on your prop's value rather than its own internal state. You
will be required to keep the state up to date (this is where `onStateChange`
comes in really handy), but you can also control the state from anywhere, be
that state from other components, `redux`, `react-router`, or anywhere else.

> Note: This is very similar to how normal controlled components work elsewhere
> in react (like `<input />`). If you want to learn more about this concept, you
> can learn about that from this the
> [Advanced React Component Patterns course](#advanced-react-component-patterns-course)

## Returned props

You use the hook like so:

```javascript
import {useMultipleSelection} from 'downshift'
import {items} from './utils'

const {
  getDropdownProps,
  getSelectedItemProps,
  selectedItems,
  reset,
  ...rest
} = useMultipleSelection({
  initialSelectedItems: [items[0], [items[1]]],
  ...otherProps,
})

return (
  <div>
    {/* render the selected items */}
    {selectedItems.map((selectedItem, index) => (
      <span
        key={`selected-item-${index}`}
        {...getSelectedItemProps({selectedItem, index})}
      >
        {selectedItem}
      </span>
    ))}
    {/* render the dropdown itself, with getToggleButtonProps coming from useSelect if you choose to build a <select> with useSelect */}
    <button {...getDropdownProps(getToggleButtonProps())}>
      Select options
    </button>
    {/* render the menu and items */}
    {/* render a button that resets the select to defaults */}
    <button
      onClick={() => {
        reset()
      }}
    >
      Reset
    </button>
  </div>
)
```

> NOTE: In this example we used both the getter props `getSelectedItemProps` and
> `getDropdownProps` and an action prop `reset`. The properties of
> `useMultipleSelection` can be split into three categories as indicated below:

### prop getters

> See [the blog post about prop getters][blog-post-prop-getters]

> NOTE: These prop-getters provide `aria-` attributes which are very important
> to your component being accessible. It's recommended that you utilize these
> functions and apply the props they give you to your components.

These functions are used to apply props to the elements that you render. This
gives you maximum flexibility to render what, when, and wherever you like. You
call these on the element in question, for example on the toggle button:
`<button {...getDropdownProps()}`. It's advisable to pass all your props to that
function rather than applying them on the element yourself to avoid your props
being overridden (or overriding the props returned). For example:
`getDropdownProps({onKeyDown(event) {console.log(event)}})`.

You will most probably use this hook along with `useSelect` or `useCombobox`,
and you can call the getter props from both of them. In the case of `select` you
can call the props on the dropdown like
`getDropdownProps(getToggleButtonProps({onKeyDown(event) {//your custom event}}))`.
Similar story with `combobox` but with `getInputProps` instead of
`getToggleButtonProps`.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property               | type           | description                                                                                      |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `getDropdownProps`     | `function({})` | returns the props you should apply to either your input or toggle button, depending on the case. |
| `getSelectedItemProps` | `function({})` | returns the props you should apply to any selected item elements you render.                     |

#### `getSelectedItemProps`

The props returned from calling this function should be applied to any selected
items you render. It allows changing the activeIndex by using arrow keys or by
clicking, but also removing items by `Delete` or `Backspace` on active item. It
also ensures that focus moves along with the activeIndex, and it keeps a
`tabindex="0"` on the active element even if user decides to `Tab` away. That
way, when tabbing back, the user can pick up where he left off with selection.

**This is an impure function**, so it should only be called when you will
actually be applying the props to an item.

<details>

<summary>What do you mean by impure function?</summary>

Basically just don't do this:

```javascript
selectedItems.map((selectedItem, index) => {
  const props = getSelectedItemProps({selectedItem, index}) // we're calling it here
  if (!shouldRenderItem(item)) {
    return null // but we're not using props, and downshift thinks we are...
  }
  return <div {...props} />
})
```

Instead, you could do this:

```jsx
selectedItems
  .filter(shouldRenderItem)
  .map(selectedItem => <div {...getSelectedItemProps({selectedItem})} />)
```

</details>

Required properties:

It is required to pass either `selectedItem` or `index` to
`getSelectedItemProps` in order to be able to apply the activeIndex logic.

- `selectedItem`: this is the item data that will be selected when the user
  selects a particular item.
- `index`: This is how `downshift` keeps track of your item when updating the
  `activeIndex` as the user keys around. By default, `downshift` will assume the
  `index` is the order in which you're calling `getSelectedItemProps`. This is
  often good enough, but if you find odd behavior, try setting this explicitly.
  It's probably best to be explicit about `index` when using a windowing library
  like `react-virtualized`.

Optional properties:

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call:
  `getSelectedItemProps({refKey: 'innerRef'})` and your composite component
  would forward like: `<li ref={props.innerRef} />`. However, if you are just
  rendering a primitive component like `<div>`, there is no need to specify this
  property. It defaults to `ref`.

#### `getDropdownProps`

Call this and apply the returned props to a `button` if you are building a
`select` or to an `input` if you're building a `combobox`. It allows you to move
focus from this element to the last item selected by using `ArrowLeft` and also
to remove the last item using `Backspace`.

Optional properties:

- `preventKeyAction`: tells `useMultipleSelection` if `dropdown` is allowed to
  execute `downshift` handlers on `keydown`. For example, you can pass `isOpen`
  as value and user will not be able to delete selecteditems by `Backspace` or
  to navigate to them by arrow keys. This is useful if you don't want to mix key
  actions from multiple selection with the ones from the dropdown. Once the
  dropdown is closed then deletion / navigation can be resumed for multiple
  selection. The value is `false` by default.
- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getDropdownProps({refKey: 'innerRef'})`
  and your composite component would forward like:
  `<button ref={props.innerRef} />`. However, if you are just rendering a
  primitive component like `<div>`, there is no need to specify this property.
  It defaults to `ref`.

In some cases, you might want to completely bypass the `refKey` check. Then you
can provide the object `{suppressRefError : true}` as the second argument to
`getDropdownProps`. **Please use it with extreme care and only if you are
absolutely sure that the ref is correctly forwarded otherwise
`useMultipleSelection` will unexpectedly fail.**

```javascript
const {getDropdownProps} = useMultipleSelection()
const {isOpen, ...rest} = useSelect({items})
const myButton = (
  {/* selected items */}
  <button {...getDropdownProps({preventKeyAction: isOpen})}>Click me</button>
  {/* menu and items */}
)
```

### actions

These are functions you can call to change the state of the downshift
`useMultipleSelection` hook.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property             | type                      | description                                           |
| -------------------- | ------------------------- | ----------------------------------------------------- |
| `addSelectedItem`    | `function(item: any)`     | adds an item to the selected array                    |
| `removeSelectedItem` | `function(item: any)`     | removes an item from the selected array               |
| `reset`              | `function()`              | resets the selectedItems and active index to defaults |
| `setActiveIndex`     | `function(index: number)` | sets activeIndex to the new value                     |
| `setSelectedItems`   | `function(items: any[])`  | sets selectedItems to the new value                   |

### state

These are values that represent the current state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property        | type     | description                           |
| --------------- | -------- | ------------------------------------- |
| `activeIndex`   | `number` | the index of thecurrently active item |
| `selectedItems` | `any[]`  | the items of the selection            |

## Event Handlers

Downshift has a few events for which it provides implicit handlers. Several of
these handlers call `event.preventDefault()`. Their additional functionality is
described below.

### Default handlers

#### Dropdown - button or input

- `ArrowLeft`: Moves focus from `button`/`input` to the last selected item and
  makes `activeIndex` to be `selectedItems.length - 1`. Performs this action if
  there are any items selected. `ArrowLeft` can be overriden with any other key
  depeding on the requirements. More info on
  [`keyNavigationPrevious`](#keynavigationprevious).
- `Backspace`: Removes the last selected item from selection. It always performs
  this action on a non-input element. If the `dropdown` is a `combobox` the text
  cursor of the `input` must be at the start of the `input` and not highlight
  any text in order for the removal to work.

#### Item

- `Click`: It will make the item active, will modify `activeIndex` to reflect
  the new change, and will add focus to that item.
- `Delete`: It will remove the item from selection. `activeIndex` will stay the
  same if the item removed was not the last one, but focus will move to the item
  which now has that index. If the last item was removed, the `activeIndex` will
  decrease by one and will also move focus to the corresponding item. If there
  are no items available anymore, the focus moves to the dropdown and
  `activeIndex` becomes `-1`.
- `Backspace`: Same effect as `Delete`.
- `ArrowLeft`: Moves `activeIndex` and focus to previous item. It stops at the
  first item in the selection. `ArrowLeft` can be overriden with any other key
  depeding on the requirements. More info on
  [`keyNavigationPrevious`](#keynavigationprevious).
- `ArrowRight`: Moves `activeIndex` and focus to next item. It will move focus
  to the `dropdown` if it occurs on the last selected item. `ArrowRight` can be
  overriden with any other key depeding on the requirements. More info on
  [`keyNavigationNext`](#keynavigationnext).

### Customizing Handlers

You can provide your own event handlers to `useMultipleSelection` which will be
called before the default handlers:

```javascript
const items = [...] // items here.
const {getDropdownProps} = useMultipleSelection()
const {getInputProps} = useCombobox({items})
const ui = (
  /* label, selected items, ... */
  <input
    {...getInputProps(
      getDropdownProps({
        onKeyDown: event => {
          // your custom keyDown handler here.
        },
      }),
    )}
  />
)
```

If you would like to prevent the default handler behavior in some cases, you can
set the event's `preventDownshiftDefault` property to `true`:

```javascript
const items = [...] // items here.
const {getDropdownProps} = useMultipleSelection()
const {getInputProps} = useCombobox({items})
const ui = (
  /* label, selected items, ... */
  <input
    {...getInputProps(
      getDropdownProps({
        onKeyDown: event => {
          // your custom keyDown handler here.
          if (event.key === 'Enter') {
            // Prevent Downshift's default 'Enter' behavior.
            event.nativeEvent.preventDownshiftDefault = true

            // your handler code
          }
        },
      }),
    )}
  />
)
```

If you would like to completely override Downshift's behavior for a handler, in
favor of your own, you can bypass prop getters:

```javascript
const items = [...] // items here.
const {getDropdownProps} = useMultipleSelection()
const {getInputProps} = useCombobox({items})
const ui = (
  /* label, selected items, ... */
  <input
    {...getInputProps(
      getDropdownProps({
        onKeyDown: event => {
          // your custom keyDown handler here.
        },
      }),
    )}
    onKeyDown={event => {
      // your custom keyDown handler here.
    }}
  />
)
```

[sandbox-example]:
  https://codesandbox.io/s/usemultipleselection-combobox-usage-ft8zd
[select-sandbox-example]:
  https://codesandbox.io/s/usemultipleselection-select-usage-x4p1j
[state-change-file]:
  https://github.com/downshift-js/downshift/blob/master/src/hooks/useMultipleSelection/stateChangeTypes.js
[blog-post-prop-getters]:
  https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf
