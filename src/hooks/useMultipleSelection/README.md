# useMultipleSelection

## The problem

You have a custom `select` or a `combobox` in your applications which performs a
multiple selection. You want want the whole experience to be accessible,
including adding and removing items from selection, navigating between the items
and back to the dropdown. ou also want this solution to be simple to use and
flexible so you can tailor it further to your specific needs.

## This solution

`useMultipleSelection` is a React hook that manages all the stateful logic
needed to make the multiple selection dropdown functional and accessible. It
returns a set of props that are meant to be called and their results
destructured on the dropdown's elements that involve the multiple selection
experience: the dropdown main element itself, which can be either `input` or the
`toggle button` element, and the selected items. These are similar to the ones
provided by vanilla `<Downshift>` to the children render prop.

These props are called getter props and their return values are destructured as
a set of ARIA attributes and event listeners. Together with the action props and
state props, they create all the stateful logic needed for the dropdown to
become accessible. Every functionality needed should be provided out-of-the-box:
arrow navigation between dropdown and items, navigation between the items
themselves, removing and adding items, and also helpful messages such as when an
item has been removed from selection.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Basic Props](#basic-props)
  - [itemToString](#itemtostring)
  - [onItemsChange](#onitemschange)
  - [stateReducer](#statereducer)
- [Advanced Props](#advanced-props)
  - [initialItems](#initialitems)
  - [initialActiveIndex](#initialactiveindex)
  - [defaultItems](#defaultitems)
  - [defaultActiveIndex](#defaultactiveindex)
  - [getA11yRemovalMessage](#geta11yremovalmessage)
  - [onActiveIndexChange](#onactiveindexchange)
  - [onStateChange](#onstatechange)
  - [activeIndex](#activeindex)
  - [items](#items)
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
import React from 'react'
import {render} from 'react-dom'
import {useSelect} from 'downshift'
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
    getItemProps: getSelectedItemProps,
    getDropdownProps,
    addItem,
    removeItem,
    items: selectedItems,
  } = useMultipleSelection({initialItems: [items[0], items[1]]})
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
            addItem(selectedItem)
            selectItem(null)
          }

          break
        default:
          break
      }
    },
  })

  return (
    <>
      <label {...getLabelProps()}>Choose some elements:</label>
      <div style={comboboxWrapperStyles}>
        {selectedItems.map((selectedItem, index) => (
          <span
            style={selectedItemStyles}
            key={`selected-item-${index}`}
            {...getSelectedItemProps({item: selectedItem, index})}
          >
            {selectedItem}
            <span
              style={selectedItemIconStyles}
              onClick={() => removeItem(selectedItem)}
            >
              &#10005;
            </span>
          </span>
        ))}
        <div style={comboboxStyles} {...getComboboxProps()}>
          <input {...getInputProps(getDropdownProps({isOpen}))} />
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
    </>
  )
}

render(<DropdownMultipleCombobox />, document.getElementById('root'))
```

## Basic Props

This is the list of props that you should probably know about. There are some
[advanced props](#advanced-props) below as well.

### itemToString

> `function(item: any)` | defaults to: `i => (i == null ? '' : String(i))`

Used to determine the string value for the selected item. It is used to compute
the accessibility message that occurs after removing the item.

### onItemsChange

> `function(changes: object)` | optional, no useful default

Called each time the selected items array changes. Especially useful when items
are removed, as there are many ways to do that: `Backspace` from dropdown,
`Backspace` or `Delete` while focus is the item, executing `removeItem` when
clicking an associated `X` icon for the item.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `items` property with
  the new array value. This also has a `type` property which you can learn more
  about in the [`stateChangeTypes`](#statechangetypes) section. This property
  will be part of the actions that can trigger an `items` change, for example
  `useSelect.stateChangeTypes.DropdownKeyDownBackspace`.

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

const {getDropdownProps, getItemProps, ...rest} = useMultipleSelection({
  initialItems: [items[0], items[1]],
  stateReducer,
})

function stateReducer(state, actionAndChanges) {
  // this adds focus to the dropdown when item is removed by keyboard action.
  if (
    action.type ===
      useMultipleSelection.stateChangeTypes.ItemKeyDownBackspace ||
    action.type === useMultipleSelection.stateChangeTypes.ItemKeyDownDelete
  ) {
    action.changes.activeIndex = -1
  }

  return action.changes
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

### initialItems

> `any[]` | defaults to `[]`

Pass an initial array of items that are considered to be selected.

### initialActiveIndex

> `number` | defaults to `-1`

Pass a number that sets the index of the focused / active selected item when
downshift is initialized.

### defaultItems

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

A default `getA11yRemovalMessage` function is provided. It is called with the
parameters `resultCount` (actually `items.length`), `removedItem` and
`itemToString` when and item is removed and `items` length decreases. When an
item is removed, the message is a removal related one, narrating
"`itemToString(selectedItem)` has been removed".

The object you are passed to generate your status message for
`getA11yRemovalMessage` has the following properties:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property       | type            | description                                                                                  |
| -------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `resultCount`  | `number`        | The count of items in the list.                                                              |
| `isOpen`       | `boolean`       | The `isOpen` state                                                                           |
| `itemToString` | `function(any)` | The `itemToString` function (see props) for getting the string value from one of the options |
| `selectedItem` | `any`           | The value of the currently selected item                                                     |

### onActiveIndexChange

> `function(changes: object)` | optional, no useful default

Called each time the index of the active item changes. When an item becomes
active, it receives focus, so it can receive keyboard events. To change
`activeIndex` you can either click on the item or use navigation arrows between
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
all of the state (e.g. items and activeIndex) and then pass it as props, rather
than letting downshift control all its state itself.

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
> `<button {...getToggleButtonProps({onBlur: handleBlur})} />`).

### activeIndex

> `number` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The index of the item that should be active and focused.

### items

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

- `useMultipleSelection.stateChangeTypes.ItemClick`
- `useMultipleSelection.stateChangeTypes.ItemKeyDownDelete`
- `useMultipleSelection.stateChangeTypes.ItemKeyDownBackspace`
- `useMultipleSelection.stateChangeTypes.ItemKeyDownArrowRight`
- `useMultipleSelection.stateChangeTypes.ItemKeyDownArrowLeft`
- `useMultipleSelection.stateChangeTypes.DropdownKeyDownArrowLeft`
- `useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace`
- `useMultipleSelection.stateChangeTypes.DropdownClick`
- `useMultipleSelection.stateChangeTypes.FunctionAddItem`
- `useMultipleSelection.stateChangeTypes.FunctionRemoveItem`
- `useMultipleSelection.stateChangeTypes.FunctionSetItems`
- `useMultipleSelection.stateChangeTypes.FunctionSetActiveIndex`
- `useMultipleSelection.stateChangeTypes.FunctionReset`

See [`stateReducer`](#statereducer) for a concrete example on how to use the
`type` property.

## Control Props

Downshift manages its own state internally and calls your `onItemsChange`,
`onActiveIndexChange` and `onStateChange` handlers with any relevant changes.
The state that downshift manages includes: `items` and `activeIndex`. Returned
action function (read more below) can be used to manipulate this state and can
likely support many of your use cases.

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
  getItemProps,
  items: selectedItems,
  reset,
  ...rest
} = useMultipleSelection({
  initialItems: [items[0], [items[1]]],
  ...otherProps,
})

return (
  <div>
    {/* render the selected items */}
    {selectedItems.map((selectedItem, index) => (
      <span
        key={`selected-item-${index}`}
        {...getItemProps({item: selectedItem, index})}
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

> NOTE: In this example we used both the getter props `getItemProps` and
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

| property           | type           | description                                                                                      |
| ------------------ | -------------- | ------------------------------------------------------------------------------------------------ |
| `getDropdownProps` | `function({})` | returns the props you should apply to either your input or toggle button, depending on the case. |
| `getItemProps`     | `function({})` | returns the props you should apply to any selected item elements you render.                     |

#### `getItemProps`

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
items.map((item, index) => {
  const props = getItemProps({item, index}) // we're calling it here
  if (!shouldRenderItem(item)) {
    return null // but we're not using props, and downshift thinks we are...
  }
  return <div {...props} />
})
```

Instead, you could do this:

```jsx
items.filter(shouldRenderItem).map(item => <div {...getItemProps({item})} />)
```

</details>

Required properties:

It is required to pass either `item` or `index` to `getItemProps` in order to be
able to apply the activeIndex logic.

- `item`: this is the item data that will be selected when the user selects a
  particular item.
- `index`: This is how `downshift` keeps track of your item when updating the
  `activeIndex` as the user keys around. By default, `downshift` will assume the
  `index` is the order in which you're calling `getItemProps`. This is often
  good enough, but if you find odd behavior, try setting this explicitly. It's
  probably best to be explicit about `index` when using a windowing library like
  `react-virtualized`.

Optional properties:

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getItemProps({refKey: 'innerRef'})` and
  your composite component would forward like: `<li ref={props.innerRef} />`.
  However, if you are just rendering a primitive component like `<div>`, there
  is no need to specify this property. It defaults to `ref`.

#### `getDropdownProps`

Call this and apply the returned props to a `button` if you are building a
`select` or to an `input` if you're building a combobox. It allows you to move
focus from this element to the last item selected by using `ArrowLeft` and also
to remove the last item using `Backspace`.

Required properties:

It is required to pass `isOpen` to `getDropdownProps`. By convention, it is
required for the `dropdown` to be closed in order to perform focus switch or
deletion of items.

- `isOpen`: tells `useMultipleSelection` if `dropdown` is closed and only then
  it can have focus moved to items or remove items by keyboard.

Optional properties:

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getDropdownProps({refKey: 'innerRef'})`
  and your composite component would forward like:
  `<button ref={props.innerRef} />`. However, if you are just rendering a
  primitive component like `<div>`, there is no need to specify this property.
  It defaults to `ref`.

```javascript
const {getDropdownProps} = useMultipleSelection()
const {isOpen, ...rest} = useSelect({items})
const myButton = (
  {/* selected items */}
  <button {...getDropdownProps({isOpen})}>Click me</button>
  {/* menu and items */}
)
```

### actions

These are functions you can call to change the state of the downshift
`useMultipleSelection` hook.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property         | type                      | description                                   |
| ---------------- | ------------------------- | --------------------------------------------- |
| `addItem`        | `function(item: any)`     | adds an item to the selected array            |
| `removeItem`     | `function(item: any)`     | removes an item from the selected array       |
| `reset`          | `function()`              | resets the items and active index to defaults |
| `setActiveIndex` | `function(index: number)` | sets activeIndex to the new value             |
| `setItems`       | `function(items: any[])`  | sets items to the new value                   |

### state

These are values that represent the current state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property      | type     | description                           |
| ------------- | -------- | ------------------------------------- |
| `activeIndex` | `number` | the index of thecurrently active item |
| `items`       | `any[]`  | the items of the selection            |

## Event Handlers

Downshift has a few events for which it provides implicit handlers. Several of
these handlers call `event.preventDefault()`. Their additional functionality is
described below.

### Default handlers

#### Dropdown - button or input

- `ArrowLeft`: Moves focus from `button`/`input` to the last selected item and
  makes `activeIndex` to be `items.length - 1`. Performs this action if there
  are any items selected.
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
  first item in the selection.
- `ArrowRight`: Moves `activeIndex` and focus to next item. It will move focus
  to the `dropdown` if it occurs on the last selected item.

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

[sandbox-example]: https://codesandbox.io/s/53qfj
[state-change-file]:
  https://github.com/downshift-js/downshift/blob/master/src/hooks/useMultipleSelection/stateChangeTypes.js
[blog-post-prop-getters]:
  https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf
