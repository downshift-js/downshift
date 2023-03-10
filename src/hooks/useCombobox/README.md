# useCombobox

## The problem

You have a combobox or autocomplete dropdown in your application and you want it
to be accessible and functional. For consistency reasons you want it to follow
the [ARIA design pattern][combobox-aria-example] for a combobox. You also want
this solution to be simple to use and flexible so you can tailor it further to
your specific needs.

## This solution

`useCombobox` is a React hook that manages all the stateful logic needed to make
the combobox functional and accessible. It returns a set of props that are meant
to be called and their results destructured on the combobox's elements: its
label, toggle button, input, list and list items. The props are similar to the
ones provided by vanilla `<Downshift>` to the children render prop.

These props are called getter props and their return values are destructured as
a set of ARIA attributes and event listeners. Together with the action props and
state props, they create all the stateful logic needed for the combobox to
implement the corresponding ARIA pattern. Every functionality needed should be
provided out-of-the-box: menu toggle, item selection and up/down movement
between them, screen reader support, highlight by character keys etc.

## Types of Autocomplete

By default, our implementation and examples illustrate an autocomplete of type
_list_. This involves performing your own items filtering logic as well as
keeping the _aria_autocomplete_ value returned by the
[getInputProps](#getinputprops).

There are, in total, 3 types of autocomplete you can opt for, and these are as
follows:

- no autocomplete:
  - [ARIA example][combobox-aria-example-none]
  - use _aria-autocomplete="none"_ attribute to override the default value from
    _getInputProps_.
  - do not implement any filtering logic yourself, just render the listbox
    items. Basically, take the [code example](#usage) below, remove the useState
    with items, the onInputValueChange function, pass _colors_ as _items_ prop
    and render the _colors_ if _isOpen_ is _true_.
- list autocomplete:
  - [ARIA example][combobox-aria-example]
  - just use the [example provided below](#usage) or anything equivalent.
  - filtering logic inside the menu is done by the _useCombobox_ consumer.
- list and inline autocomplete:
  - [ARIA example][combobox-aria-example-both]
  - use _aria-autocomplete="both"_ attribute to override the default value from
    _getInputProps_.
  - filtering logic inside the menu is done by the _useCombobox_ consumer.
  - inline autocomplete based on the highlighted item in the menu is also
    performed by the consumer.

## Migration to v7

`useCombobox` received some changes related to how it works in version 7, as a
conequence of adapting it to the ARIA 1.2 combobox pattern. If you were using
_useCombobox_ previous to 7.0.0, check the [migration guide][migration-guide-v7]
and update if necessary.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Basic Props](#basic-props)
  - [items](#items)
  - [itemToString](#itemtostring)
  - [onSelectedItemChange](#onselecteditemchange)
  - [stateReducer](#statereducer)
- [Advanced Props](#advanced-props)
  - [initialSelectedItem](#initialselecteditem)
  - [initialIsOpen](#initialisopen)
  - [initialHighlightedIndex](#initialhighlightedindex)
  - [initialInputValue](#initialinputvalue)
  - [defaultSelectedItem](#defaultselecteditem)
  - [defaultIsOpen](#defaultisopen)
  - [defaultHighlightedIndex](#defaulthighlightedindex)
  - [defaultInputValue](#defaultinputvalue)
  - [getA11yStatusMessage](#geta11ystatusmessage)
  - [getA11ySelectionMessage](#geta11yselectionmessage)
  - [onHighlightedIndexChange](#onhighlightedindexchange)
  - [onIsOpenChange](#onisopenchange)
  - [onInputValueChange](#oninputvaluechange)
  - [onStateChange](#onstatechange)
  - [highlightedIndex](#highlightedindex)
  - [isOpen](#isopen)
  - [selectedItem](#selecteditem)
  - [inputValue](#inputvalue)
  - [id](#id)
  - [labelId](#labelid)
  - [menuId](#menuid)
  - [toggleButtonId](#togglebuttonid)
  - [inputId](#inputid)
  - [getItemId](#getitemid)
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
- [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

> [Try it out in the browser][sandbox-example]

```jsx
import * as React from 'react'
import {render} from 'react-dom'
import {useCombobox} from 'downshift'

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

function DropdownCombobox() {
  const [inputItems, setInputItems] = React.useState(colors)
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    selectItem,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({inputValue}) => {
      setInputItems(
        colors.filter(item =>
          item.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      )
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
      <div>
        <input
          style={{padding: '4px'}}
          {...getInputProps()}
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
          aria-label="toggle menu"
          data-testid="clear-button"
          onClick={() => selectItem(null)}
        >
          &#10007;
        </button>
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
          inputItems.map((item, index) => (
            <li
              style={{
                padding: '4px',
                backgroundColor: highlightedIndex === index ? '#bde4ff' : null,
              }}
              key={`${item}${index}`}
              {...getItemProps({
                item,
                index,
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}

render(<DropdownCombobox />, document.getElementById('root'))
```

## Basic Props

This is the list of props that you should probably know about. There are some
[advanced props](#advanced-props) below as well.

### items

> `any[]` | _required_

The main difference from vanilla `Downshift` is that we pass the items we want
to render to the hook as well. Opening the menu with an item already selected
means the hook has to know in advance what items you plan to render and what is
the position of that item in the list. Consequently, there won't be any need for
two state changes: one for opening the menu and one for setting the highlighted
index, like in `Downshift`.

### itemToString

> `function(item: any)` | defaults to: `item => (item ? String(item) : '')`

If your items are stored as, say, objects instead of strings, downshift still
needs a string representation for each one. This is required for accessibility
aria-live messages (e.g., after making a selection).

**Note:** This callback _must_ include a null check: it is invoked with `null`
whenever the user abandons input via `<Esc>`.

### onSelectedItemChange

> `function(changes: object)` | optional, no useful default

Called each time the selected item was changed. Selection can be performed by
item click, Enter Key while item is highlighted or by blurring the menu while an
item is highlighted (Tab, Shift-Tab or clicking away).

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `selectedItem` property
  with the newly selected value. This also has a `type` property which you can
  learn more about in the [`stateChangeTypes`](#statechangetypes) section. This
  property will be part of the actions that can trigger a `selectedItem` change,
  for example `useCombobox.stateChangeTypes.ItemClick`.

### stateReducer

> `function(state: object, actionAndChanges: object)` | optional

**🚨 This is a really handy power feature 🚨**

This function will be called each time `useCombobox` sets its internal state (or
calls your `onStateChange` handler for control props). It allows you to modify
the state change that will take place which can give you fine grain control over
how the component interacts with user updates. It gives you the current state
and the state that will be set, and you return the state that you want to set.

- `state`: The full current state of downshift.
- `actionAndChanges`: Object that contains the action `type`, props needed to
  return a new state based on that type and the changes suggested by the
  Downshift default reducer. About the `type` property you can learn more about
  in the [`stateChangeTypes`](#statechangetypes) section.

```javascript
import {useCombobox} from 'downshift'
import {items} from './utils'

const {getMenuProps, getItemProps, ...rest} = useCombobox({
  items,
  stateReducer,
})

function stateReducer(state, actionAndChanges) {
  const {type, changes} = actionAndChanges
  // this prevents the menu from being closed when the user selects an item with 'Enter' or mouse
  switch (type) {
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.ItemClick:
      return {
        ...changes, // default Downshift new state changes on item selection.
        isOpen: state.isOpen, // but keep menu open.
        highlightedIndex: state.highlightedIndex, // with the item highlighted.
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

### initialSelectedItem

> `any` | defaults to `null`

Pass an item that should be selected when downshift is initialized.

### initialIsOpen

> `boolean` | defaults to `false`

Pass a boolean that sets the open state of the menu when downshift is
initialized.

### initialHighlightedIndex

> `number` | defaults to `-1`

Pass a number that sets the index of the highlighted item when downshift is
initialized.

### initialInputValue

> `string` | defaults to `''`

Pass a string that sets the content of the input when downshift is initialized.

### defaultSelectedItem

> `any` | defaults to `null`

Pass an item that should be selected when downshift is reset.

### defaultIsOpen

> `boolean` | defaults to `false`

Pass a boolean that sets the open state of the menu when downshift is reset or
when an item is selected.

### defaultHighlightedIndex

> `number` | defaults to `-1`

Pass a number that sets the index of the highlighted item when downshift is
reset or when an item is selected.

### defaultInputValue

> `string` | defaults to `''`

Pass a string that sets the content of the input when downshift is reset or when
an item is selected.

### selectedItemChanged

> `function(prevItem: any, item: any)` | defaults to:
> `(prevItem, item) => (prevItem !== item)`

Used to determine if the new `selectedItem` has changed compared to the previous
`selectedItem` and properly update Downshift's internal state.

### getA11yStatusMessage

> `function({/* see below */})` | default messages provided in English

This function is passed as props to a status updating function nested within
that allows you to create your own ARIA statuses. It is called when one of the
following props change: `items`, `highlightedIndex`, `inputValue` or `isOpen`.

A default `getA11yStatusMessage` function is provided that will check
`resultCount` and return "No results are available." or if there are results ,
"`resultCount` results are available, use up and down arrow keys to navigate.
Press Enter key to select."

> Note: `resultCount` is `items.length` in our default version of the function.

### getA11ySelectionMessage

> `function({/* see below */})` | default messages provided in English

This function is similar to the `getA11yStatusMessage` but it is generating a
message when an item is selected. It is passed as props to a status updating
function nested within that allows you to create your own ARIA statuses. It is
called when `selectedItem` changes.

A default `getA11ySelectionMessage` function is provided. When an item is
selected, the message is a selection related one, narrating
"`itemToString(selectedItem)` has been selected".

The object you are passed to generate your status message, for both
`getA11yStatusMessage` and `getA11ySelectionMessage`, has the following
properties:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property              | type            | description                                                                                  |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `highlightedIndex`    | `number`        | The currently highlighted index                                                              |
| `highlightedItem`     | `any`           | The value of the highlighted item                                                            |
| `isOpen`              | `boolean`       | The `isOpen` state                                                                           |
| `inputValue`          | `string`        | The value in the text input.                                                                 |
| `itemToString`        | `function(any)` | The `itemToString` function (see props) for getting the string value from one of the options |
| `previousResultCount` | `number`        | The total items showing in the dropdown the last time the status was updated                 |
| `resultCount`         | `number`        | The total items showing in the dropdown                                                      |
| `selectedItem`        | `any`           | The value of the currently selected item                                                     |

### onHighlightedIndexChange

> `function(changes: object)` | optional, no useful default

Called each time the highlighted item was changed. Items can be highlighted
while hovering the mouse over them or by keyboard keys such as Up Arrow, Down
Arrow, Home and End. Items can also be highlighted by hitting character keys
that are part of their starting string equivalent.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `highlightedIndex`
  property with the new value. This also has a `type` property which you can
  learn more about in the [`stateChangeTypes`](#statechangetypes) section. This
  property will be part of the actions that can trigger a `highlightedIndex`
  change, for example `useCombobox.stateChangeTypes.InputKeyDownArrowUp`.

### onIsOpenChange

> `function(changes: object)` | optional, no useful default

Called each time the menu is open or closed. Menu can be open by toggle button
click, Enter, Space, Up Arrow or Down Arrow keys. Can be closed by selecting an
item, blur (Tab, Shift-Tab or clicking outside), clicking the toggle button
again or hitting Escape key.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `isOpen` property with
  the new value. This also has a `type` property which you can learn more about
  in the [`stateChangeTypes`](#statechangetypes) section. This property will be
  part of the actions that can trigger a `isOpen` change, for example
  `useCombobox.stateChangeTypes.ToggleButtonClick`.

### onInputValueChange

> `function(changes: object)` | optional, no useful default

Called each time the value in the input text changes. The input value should
change like any input of type text, at any character key press, `Space`,
`Backspace`, `Escape` etc.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `inputValue` property
  with the new value. This also has a `type` property which you can learn more
  about in the [`stateChangeTypes`](#statechangetypes) section. This property
  will be part of the actions that can trigger a `inputValue` change, for
  example `useCombobox.stateChangeTypes.InputChange`.

### onStateChange

> `function(changes: object)` | optional, no useful default

This function is called anytime the internal state changes. This can be useful
if you're using downshift as a "controlled" component, where you manage some or
all of the state (e.g., isOpen, selectedItem, highlightedIndex, etc) and then
pass it as props, rather than letting downshift control all its state itself.

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

### highlightedIndex

> `number` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The index of the item that should be highlighted when menu is open.

### isOpen

> `boolean` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The open state of the menu.

### selectedItem

> `any` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The item that should be selected.

### inputValue

> `string` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The value to be displayed in the text input.

### id

> `string` | defaults to a generated ID

Used to generate the first part of the `Downshift` id on the elements. You can
override this `id` with one of your own, provided as a prop, or you can override
the `id` for each element altogether using the props below.

### labelId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`label`) you use
[`getLabelProps`](#getlabelprops) with.

### menuId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`ul`) you use
[`getMenuProps`](#getmenuprops) with.

### toggleButtonId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`button`) you use
[`getToggleButtonProps`](#gettogglebuttonprops) with.

### inputId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`input`) you use
[`getInputProps`](#getmenuprops) with.

### getItemId

> `function(index)` | defaults to a function that generates an ID based on the
> index

Used for `aria` attributes and the `id` prop of the element (`li`) you use
[`getItemProps`](#getitemprops) with.

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

- `useCombobox.stateChangeTypes.InputKeyDownArrowDown`
- `useCombobox.stateChangeTypes.InputKeyDownArrowUp`
- `useCombobox.stateChangeTypes.InputKeyDownEscape`
- `useCombobox.stateChangeTypes.InputKeyDownHome`
- `useCombobox.stateChangeTypes.InputKeyDownEnd`
- `useCombobox.stateChangeTypes.InputKeyDownPageUp`
- `useCombobox.stateChangeTypes.InputKeyDownPadeDown`
- `useCombobox.stateChangeTypes.InputKeyDownEnter`
- `useCombobox.stateChangeTypes.InputChange`
- `useCombobox.stateChangeTypes.InputFocus`
- `useCombobox.stateChangeTypes.InputBlur`
- `useCombobox.stateChangeTypes.MenuMouseLeave`
- `useCombobox.stateChangeTypes.ItemMouseMove`
- `useCombobox.stateChangeTypes.ItemClick`
- `useCombobox.stateChangeTypes.ToggleButtonClick`
- `useCombobox.stateChangeTypes.FunctionToggleMenu`
- `useCombobox.stateChangeTypes.FunctionOpenMenu`
- `useCombobox.stateChangeTypes.FunctionCloseMenu`
- `useCombobox.stateChangeTypes.FunctionSetHighlightedIndex`
- `useCombobox.stateChangeTypes.FunctionSelectItem`
- `useCombobox.stateChangeTypes.FunctionSetInputValue`
- `useCombobox.stateChangeTypes.FunctionReset`

See [`stateReducer`](#statereducer) for a concrete example on how to use the
`type` property.

## Control Props

Downshift manages its own state internally and calls your
`onSelectedItemChange`, `onIsOpenChange`, `onHighlightedIndexChange`,
`onInputChange` and `onStateChange` handlers with any relevant changes. The
state that downshift manages includes: `isOpen`, `selectedItem`, `inputValue`
and `highlightedIndex`. Returned action function (read more below) can be used
to manipulate this state and can likely support many of your use cases.

However, if more control is needed, you can pass any of these pieces of state as
a prop (as indicated above) and that state becomes controlled. As soon as
`this.props[statePropKey] !== undefined`, internally, `downshift` will determine
its state based on your prop's value rather than its own internal state. You
will be required to keep the state up to date (this is where `onStateChange`
comes in really handy), but you can also control the state from anywhere, be
that state from other components, `redux`, `react-router`, or anywhere else.

> Note: This is very similar to how normal controlled components work elsewhere
> in react (like `<input />`). If you want to learn more about this concept, you
> can learn about that from the [Advanced React Component Patterns
> course][advanced-react-component-patterns-course]

## Returned props

You use the hook like so:

```javascript
import {useCombobox} from 'downshift'
import {items} from './utils'

const {getInputProps, reset, ...rest} = useCombobox({
  items,
  ...otherProps,
})

return (
  <div>
    <input {...getInputProps()} />
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

> NOTE: In this example we used both a getter prop `getInputProps` and an action
> prop `reset`. The properties of `useCombobox` can be split into three
> categories as indicated below:

### prop getters

> See [the blog post about prop getters][blog-post-prop-getters]

> NOTE: These prop-getters provide `aria-` attributes which are very important
> to your component being accessible. It's recommended that you utilize these
> functions and apply the props they give you to your components.

These functions are used to apply props to the elements that you render. This
gives you maximum flexibility to render what, when, and wherever you like. You
call these on the element in question, for example on the toggle button:
`<button {...getToggleButtonProps()}`. It's advisable to pass all your props to
that function rather than applying them on the element yourself to avoid your
props being overridden (or overriding the props returned). For example:
`getToggleButtonProps({onKeyDown(event) {console.log(event)}})`.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property               | type           | description                                                                                    |
| ---------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `getToggleButtonProps` | `function({})` | returns the props you should apply to any menu toggle button element you render.               |
| `getItemProps`         | `function({})` | returns the props you should apply to any menu item elements you render.                       |
| `getLabelProps`        | `function({})` | returns the props you should apply to the `label` element that you render.                     |
| `getMenuProps`         | `function({})` | returns the props you should apply to the `ul` element (or root of your menu) that you render. |
| `getInputProps`        | `function({})` | returns the props you should apply to the `input` element that you render.                     |

#### `getLabelProps`

This method should be applied to the `label` you render. It will generate an
`id` that will be used to label the toggle button and the menu.

There are no required properties for this method.

> Note: For accessibility purposes, calling this method is highly recommended.

#### `getMenuProps`

This method should be applied to the element which contains your list of items.
Typically, this will be a `<div>` or a `<ul>` that surrounds a `map` expression.
This handles the proper ARIA roles and attributes.

Optional properties:

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getMenuProps({refKey: 'innerRef'})` and
  your composite component would forward like: `<ul ref={props.innerRef} />`.
  However, if you are just rendering a primitive component like `<div>`, there
  is no need to specify this property. It defaults to `ref`.

  Please keep in mind that menus, for accessiblity purposes, should always be
  rendered, regardless of whether you hide it or not. Otherwise, `getMenuProps`
  may throw error if you unmount and remount the menu.

- `aria-label`: By default the menu will add an `aria-labelledby` that refers to
  the `<label>` rendered with `getLabelProps`. However, if you provide
  `aria-label` to give a more specific label that describes the options
  available, then `aria-labelledby` will not be provided and screen readers can
  use your `aria-label` instead.

In some cases, you might want to completely bypass the `refKey` check. Then you
can provide the object `{suppressRefError : true}` as the second argument to
`getMenuProps`. **Please use it with extreme care and only if you are absolutely
sure that the ref is correctly forwarded otherwise `useCombobox` will
unexpectedly fail.**

```jsx
const {getMenuProps} = useCombobox({items})
const ui = (
  <ul {...getMenuProps()}>
    {!isOpen
      ? null
      : items.map((item, index) => (
          <li {...getItemProps({item, index, key: item.id})}>{item.name}</li>
        ))}
  </ul>
)
```

> Note that for accessibility reasons it's best if you always render this
> element whether or not downshift is in an `isOpen` state.

#### `getItemProps`

The props returned from calling this function should be applied to any menu
items you render.

**This is an impure function**, so it should only be called when you will
actually be applying the props to an item.

<details>

<summary>What do you mean by impure function?</summary>

Basically just don't do this:

```jsx
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

The main difference from vanilla `Downshift` is that we require the items as
props before rendering. The reason is to open the menu with items already
highlighted, and we need to know the items before the actual render. It is still
required to pass either `item` or `index` to `getItemProps`.

- `item`: this is the item data that will be selected when the user selects a
  particular item.
- `index`: This is how `downshift` keeps track of your item when updating the
  `highlightedIndex` as the user keys around. By default, `downshift` will
  assume the `index` is the order in which you're calling `getItemProps`. This
  is often good enough, but if you find odd behavior, try setting this
  explicitly. It's probably best to be explicit about `index` when using a
  windowing library like `react-virtualized`.

Optional properties:

- `ref`: if you need to access the item element via a ref object, you'd call the
  function like this: `getItemProps({ref: yourItemRef})`. As a result, the item
  element will receive a composed `ref` property, which guarantees that both
  your code and `useCombobox` use the same correct reference to the element.

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getItemProps({refKey: 'innerRef'})` and
  your composite component would forward like: `<li ref={props.innerRef} />`.
  However, if you are just rendering a primitive component like `<div>`, there
  is no need to specify this property. It defaults to `ref`.

- `disabled`: If this is set to `true`, then all of the downshift item event
  handlers will be omitted. Items will not be highlighted when hovered, and
  items will not be selected when clicked.

#### `getToggleButtonProps`

Call this and apply the returned props to a `button`. It allows you to toggle
the `Menu` component.

Optional properties:

- `ref`: if you need to access the button element via a ref object, you'd call
  the function like this: `getToggleButton({ref: yourButtonRef})`. As a result,
  the button element will receive a composed `ref` property, which guarantees
  that both your code and `useCombobox` use the same correct reference to the
  element.

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getToggleButton({refKey: 'innerRef'})`
  and your composite component would forward like:
  `<button ref={props.innerRef} />`. However, if you are just rendering a
  primitive component like `<div>`, there is no need to specify this property.
  It defaults to `ref`.

- `disabled`: If this is set to `true`, then all of the downshift button event
  handlers will be omitted (it won't toggle the menu when clicked).

```jsx
const {getToggleButtonProps} = useCombobox({items})
const myButton = (
  <button {...getToggleButtonProps()}>Click me</button>
  {/* menu and items */}
)
```

#### `getInputProps`

This method should be applied to the `input` you render. It is recommended that
you pass all props as an object to this method which will compose together any
of the event handlers you need to apply to the `input` while preserving the ones
that `downshift` needs to apply to make the `input` behave.

There are no required properties for this method.

Optional properties:

- `disabled`: If this is set to true, then no event handlers will be returned
  from `getInputProps` and a `disabled` prop will be returned (effectively
  disabling the input).

- `ref`: if you need to access the input element via a ref object, you'd call
  the function like this: `getInputProps({ref: yourInputRef})`. As a result, the
  input element will receive a composed `ref` property, which guarantees that
  both your code and `useCombobox` use the same correct reference to the
  element.

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getInputProps({refKey: 'innerRef'})` and
  your composite component would forward like: `<input ref={props.innerRef} />`.
  However, if you are just rendering a primitive component like `<div>`, there
  is no need to specify this property. It defaults to `ref`.

In some cases, you might want to completely bypass the `refKey` check. Then you
can provide the object `{suppressRefError : true}` as the second argument to
`getInput`. **Please use it with extreme care and only if you are absolutely
sure that the ref is correctly forwarded otherwise `useCombobox` will
unexpectedly fail.**

### actions

These are functions you can call to change the state of the downshift
`useCombobox` hook.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property              | type                      | description                                           |
| --------------------- | ------------------------- | ----------------------------------------------------- |
| `closeMenu`           | `function()`              | closes the menu                                       |
| `openMenu`            | `function()`              | opens the menu                                        |
| `selectItem`          | `function(item: any)`     | selects the given item                                |
| `setHighlightedIndex` | `function(index: number)` | call to set a new highlighted index                   |
| `setInputValue`       | `function(value: string)` | call to set a new value in the input                  |
| `toggleMenu`          | `function()`              | toggle the menu open state                            |
| `reset`               | `function()`              | this resets downshift's state to a reasonable default |

### state

These are values that represent the current state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property           | type      | description                       |
| ------------------ | --------- | --------------------------------- |
| `highlightedIndex` | `number`  | the currently highlighted item    |
| `isOpen`           | `boolean` | the menu open state               |
| `selectedItem`     | `any`     | the currently selected item input |
| `inputValue`       | `string`  | the value in the input            |

## Event Handlers

Downshift has a few events for which it provides implicit handlers. Several of
these handlers call `event.preventDefault()`. Their additional functionality is
described below.

### Default handlers

#### Toggle Button

- `Click`: If the menu is not displayed, it will open it. Otherwise it will
  close it. It will additionally move focus on the input in order for screen
  readers to correctly narrate which item is currently highlighted. If there is
  already an item selected, the menu will be opened with that item already
  highlighted.
- `Enter`: Has the same effect as `Click`. Button not in the tab order by
  default.
- `Space`: Has the same effect as `Click`. Button not in the tab order by
  default.

#### Input

- `ArrowDown`: Moves `highlightedIndex` one position down. When reaching the
  last option, `ArrowDown` will move `highlightedIndex` to first position.
- `ArrowUp`: Moves `highlightedIndex` one position up. When reaching the first
  option, `ArrowUp` will move `highlightedIndex` to last position.
- `Alt+ArrowDown`: If the menu is closed, it will open it, without highlighting
  any item.
- `Alt+ArrowUp`: If the menu is open, it will close it and will select the item
  that was highlighted.
- `CharacterKey`: Will change the `inputValue` according to the value visible in
  the `<input>`. `Backspace` or `Space` trigger the same event.
- `End`: If the menu is open, it will highlight the last item in the list.
- `Home`: If the menu is open, it will highlight the first item in the list.
- `PageUp`: If the menu is open, it will move the highlight the item 10
  positions before the current selection.
- `PageDown`: If the menu is open, it will move the highlight the item 10
  positions after the current selection.
- `Enter`: If there is a highlighted option, it will select it and close the
  menu.
- `Escape`: It will close the menu if open. If the menu is closed, it will clear
  selection: the value in the `input` will become an empty string and the item
  stored as `selectedItem` will become `null`.
- `Focus`: If the menu is closed, it will open it.
- `Blur(Tab, Shift+Tab)`: It will close the menu and select the highlighted
  item, if any. The focus will move naturally to the next/previous element in
  the Tab order.
- `Blur(mouse click outside)`: It will close the menu without selecting any
  element, even if there is one highlighted.

#### Menu

- `MouseLeave`: Will clear the value of the `highlightedIndex` if it was set.

#### Item

- `Click`: It will select the item, close the menu and move focus to the toggle
  button (unless `defaultIsOpen` is true).
- `MouseOver`: It will highlight the item.

### Customizing Handlers

You can provide your own event handlers to `useCombobox` which will be called
before the default handlers:

```javascript
const items = [...] // items here.
const {getMenuProps} = useCombobox({items})
const ui = (
  /* button, label, ... */
  <ul
    {...getMenuProps({
      onKeyDown: event => {
        // your custom keyDown handler here.
      },
    })}
  />
)
```

If you would like to prevent the default handler behavior in some cases, you can
set the event's `preventDownshiftDefault` property to `true`:

```javascript
const {getMenuProps} = useCombobox({items})
const ui = (
  /* button, label, ... */
  <ul
    {...getMenuProps({
      onKeyDown: event => {
        // your custom keyDown handler here.
        if (event.key === 'Enter') {
          // Prevent Downshift's default 'Enter' behavior.
          event.nativeEvent.preventDownshiftDefault = true

          // your handler code
        }
      },
    })}
  />
)
```

If you would like to completely override Downshift's behavior for a handler, in
favor of your own, you can bypass prop getters:

```javascript
const items = [...] // items here.
const {getMenuProps} = useCombobox({items})
const ui = (
  /* button, label, ... */
  <ul
    {...getMenuProps()}
    onKeyDown={event => {
      // your custom keyDown handler here.
    }}
  />
)
```

## Examples

Usage examples are kept on the [downshift docsite][docsite] and also on [the
sandbox repo][sandbox-repo]. Each example has a link to its own Codesandbox
version, so check the docs.

It can be a great contributing opportunity to provide relevant use cases as
docsite examples. If you have such an example, please create an issue with the
suggestion and the Codesandbox for it, and we will take it from there.

[combobox-aria-example]:
  https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-list.html
[combobox-aria-example-none]:
  https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-none.html
[combobox-aria-example-both]:
  https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-both.html
[sandbox-example]:
  https://codesandbox.io/s/github/kentcdodds/downshift-examples?file=/src/hooks/useCombobox/basic-usage.js
[state-change-file]:
  https://github.com/downshift-js/downshift/blob/master/src/hooks/useCombobox/stateChangeTypes.js
[blog-post-prop-getters]:
  https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf
[docsite]: https://downshift-js.com/
[sandbox-repo]: https://codesandbox.io/s/github/kentcdodds/downshift-examples
[advanced-react-component-patterns-course]:
  https://github.com/downshift-js/downshift#advanced-react-component-patterns-course
[migration-guide-v7]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/MIGRATION_V7.md#usecombobox
