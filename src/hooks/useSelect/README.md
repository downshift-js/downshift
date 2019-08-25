# useSelect

## The problem

You have a custom select dropdown in your application and you want it to perform exactly the same as the native HTML `<select>` in terms of accessibility and functionality. For consistency reasons you want it to follow the the [ARIA design pattern][select-aria] for a dropdown select. You also want this solution to be simple to use and flexible so you can tailor it further to your specific needs.

## This solution

`useSelect` is a React hook that manages all the stateful logic needed to make the dropdown functional and accessible. It returns a set of props that are meant to be called and their results destructured on the dropdown's elements: its label, toggle button, list and list items. It follows the same pattern as the render props provided by vanilla `<Downshift>`.

These props results are destructured as a set of ARIA attributes and event listeners. Together, they create all the stateful logic needed for the dropdown to implement the corresponding ARIA pattern. Every functionality needed should be provided out-of-the-box: menu toggle, item selection and up/down movement between them, screen reader support, highlight by character keys etc.

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
  - [defaultSelectedItem](#defaultselecteditem)
  - [defaultIsOpen](#defaultisopen)
  - [defaultHighlightedIndex](#defaulthighlightedindex)
  - [getA11yStatusMessage](#geta11ystatusmessage)
  - [onHighlightedIndexChange](#onhighlightedindexchange)
  - [onIsOpenChange](#onisopenchange)
  - [onStateChange](#onstatechange)
  - [highlightedIndex](#highlightedindex)
  - [isOpen](#isopen)
  - [selectedItem](#selecteditem)
  - [id](#id)
  - [labelId](#labelid)
  - [menuId](#menuid)
  - [toggleButtonId](#togglebuttonid)
  - [getItemId](#getitemid)
  - [circularNavigation](#circularnavigation)
- [stateChangeTypes](#statechangetypes)
- [Control Props](#control-props)
- [Returned props](#returned-props)
  - [prop getters](#prop-getters)
  - [actions](#actions)
  - [state](#state)
  - [props](#props)
- [Event Handlers](#event-handlers)
  - [Default handlers](#default-handlers)
  - [Customizing Handlers](#customizing-handlers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

> [Try it out in the browser][sandbox-example]

```jsx
import React from 'react'
import {render} from 'react-dom'
import {useSelect} from 'downshift'

function DropdownSelect() {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({items: options})
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <button {...getToggleButtonProps()}>{selectedItem || 'Elements'}</button>
      <ul {...getMenuProps()} style={menuStyles}>
        {isOpen &&
          options.map((option, index) => (
            <li
              style={
                highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
              }
              key={`${option}${index}`}
              {...getItemProps({item: option, index})}
            >
              {option}
            </li>
          ))}
      </ul>
    </div>
  )
}

const options = [
  'Neptunium',
  'Plutonium',
  'Americium',
  'Curium',
  'Berkelium',
  'Californium',
  'Einsteinium',
  'Fermium',
  'Mendelevium',
  'Nobelium',
  'Lawrencium',
  'Rutherfordium',
  'Dubnium',
  'Seaborgium',
  'Bohrium',
  'Hassium',
  'Meitnerium',
  'Darmstadtium',
  'Roentgenium',
  'Copernicium',
  'Nihonium',
  'Flerovium',
  'Moscovium',
  'Livermorium',
  'Tennessine',
  'Oganesson',
]
const menuStyles = {
  maxHeight: '200px',
  overflowY: 'auto',
  width: '150px',
  position: 'absolute',
  margin: 0,
  borderTop: 0,
  background: 'white',
}

render(<DropdownSelect />, document.getElementById('root'))
```

## Basic Props

This is the list of props that you should probably know about. There are some [advanced props](#advanced-props) below as well.

### items

> `any[]` | _required_

The main difference from vanilla `Downshift` is that we pass the items we want to render to the hook as well. Opening the menu with an item already selected means the hook has to know in advance what items you plan to render and what is the position of that item in the list. Consequently, there won't be any need for two state changes: one for opening the menu and one for setting the highlighted index, like in `Downshift`.

### itemToString

> `function(item: any)` | defaults to: `i => (i == null ? '' : String(i))`

Used to determine the string value for the selected item. It is used to compute the accessibility message that occurs after selecting the item. It is also used to allow highlighting by typing character keys, when downshift looks for the items whose string version start with the keys typed.

### onSelectedItemChange

> `function(changes: object)` | optional, no useful default

Called each time the selected item was changed. Selection can be performed by item click, Enter Key while item is highlighted or by blurring the menu while an item is highlighted (Tab, Shift-Tab or clicking away).

- `changes`: These are the properties that actually have changed since the last state change. This object is guaranteed to contain the `selectedItem` property with the newly selected value. This also has a `type` property which you can learn more about in the [`stateChangeTypes`](#statechangetypes) section. This property will be part of the actions that can trigger a `selectedItem` change, for example `useSelect.stateChangeTypes.ItemClick`.

### stateReducer

> `function(state: object, changes: object)` | optional

**🚨 This is a really handy power feature 🚨**

This function will be called each time `useSelect` sets its internal state (or calls your `onStateChange` handler for control props). It allows you to modify the state change that will take place which can give you fine grain control over how the component interacts with user updates. It gives you the current state and the state that will be set, and you return the state that you want to set.

- `state`: The full current state of downshift.
- `changes`: These are the properties that are about to change. This also has a `type` property which you can learn more about in the [`stateChangeTypes`](#statechangetypes) section.

```javascript
import {useSelect} from 'downshift'

const {getMenuProps, getItemProps, ...rest} = useSelect({
  items: options,
  stateReducer,
})

function stateReducer(state, changes) {
  // this prevents the menu from being closed when the user selects an item with a keyboard or mouse
  switch (changes.type) {
    case useSelect.stateChangeTypes.MenuKeyDownEnter:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: state.isOpen,
        highlightedIndex: state.highlightedIndex,
      }
    default:
      return changes
  }
}
```

> NOTE: This is only called when state actually changes. You should not attempt use this to handle events. If you wish to handle events, put your event handlers directly on the elements (make sure to use the prop getters though! For example `<button onBlur={handleBlur} />` should be `<button {...getToggleButtonProps({onBlur: handleBlur})} />`). Also, your reducer function should be "pure." This means it should do nothing other than return the state changes you want to have happen.

## Advanced Props

### initialSelectedItem

> `any` | defaults to `null`

Pass an item that should be selected when downshift is initialized.

### initialIsOpen

> `boolean` | defaults to `false`

Pass a boolean that sets the open state of the menu when downshift is initialized.

### initialHighlightedIndex

> `number` | defaults to `-1`

Pass a number that sets the index of the highlighted item when downshift is initialized.

### defaultSelectedItem

> `any` | defaults to `null`

Pass an item that should be selected when downshift is reset.

### defaultIsOpen

> `boolean` | defaults to `false`

Pass a boolean that sets the open state of the menu when downshift is reset or when an item is selected.

### defaultHighlightedIndex

> `number` | defaults to `-1`

Pass a number that sets the index of the highlighted item when downshift is reset or when an item is selected.

### getA11yStatusMessage

> `function({/* see below */})` | default messages provided in English

This function is passed as props to a `Status` component nested within and allows you to create your own assertive ARIA statuses.

A default `getA11yStatusMessage` function is provided. It is called with the parameters `items`, `isOpen`, `selectedItem` and `itemToString` when either `isOpen` or `selectedItem` change. When menu is opened, the announcement message is "No results" if there aren't any items or "`resultCount` results are available, use up and down arrow keys to navigate. Press Enter key to select." depending on the number of items in the menu. When `selectedItem` changes the message is a selection related one, narrating "`itemToString(selectedItem)` has been selected".

> Note: `resultCount` is `items.length` in our default version of the function.

The object you are passed to generate your status message has the following properties:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property       | type            | description                                                                                  |
| -------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `items`        | `any[]`         | The items in the list.                                                                       |
| `isOpen`       | `boolean`       | The `isOpen` state                                                                           |
| `itemToString` | `function(any)` | The `itemToString` function (see props) for getting the string value from one of the options |
| `selectedItem` | `any`           | The value of the currently selected item                                                     |

### onHighlightedIndexChange

> `function(changes: object)` | optional, no useful default

Called each time the highlighted item was changed. Items can be highlighted while hovering the mouse over them or by keyboard keys such as Up Arrow, Down Arrow, Home and End. Arrow keys can be combined with Shift to move by a step of 5 positions instead of 1. Items can also be highlighted by hitting character keys that are part of their starting string equivalent.

- `changes`: These are the properties that actually have changed since the last state change. This object is guaranteed to contain the `highlightedIndex` property with the new value. This also has a `type` property which you can learn more about in the [`stateChangeTypes`](#statechangetypes) section. This property will be part of the actions that can trigger a `highlightedIndex` change, for example `useSelect.stateChangeTypes.MenuKeyDownArrowUp`.

### onIsOpenChange

> `function(changes: object)` | optional, no useful default

Called each time the menu is open or closed. Menu can be open by toggle button click, Enter, Space, Up Arrow or Down Arrow keys. Can be closed by selecting an item, blur (Tab, Shift-Tab or clicking outside), clicking the toggle button again or hitting Escape key.

- `changes`: These are the properties that actually have changed since the last state change. This object is guaranteed to contain the `isOpen` property with the new value. This also has a `type` property which you can learn more about in the [`stateChangeTypes`](#statechangetypes) section. This property will be part of the actions that can trigger a `isOpen` change, for example `useSelect.stateChangeTypes.ToggleButtonClick`.

### onStateChange

> `function(changes: object)` | optional, no useful default

This function is called anytime the internal state changes. This can be useful if you're using downshift as a "controlled" component, where you manage some or all of the state (e.g. isOpen, selectedItem, highlightedIndex, etc) and then pass it as props, rather than letting downshift control all its state itself.

- `changes`: These are the properties that actually have changed since the last state change. This also has a `type` property which you can learn more about in the [`stateChangeTypes`](#statechangetypes) section.

> Tip: This function will be called any time _any_ state is changed. The best way to determine whether any particular state was changed, you can use `changes.hasOwnProperty('propName')` or use the `on[statePropKey]Change` props described above.

> NOTE: This is only called when state actually changes. You should not attempt to use this to handle events. If you wish handle events, put your event handlers directly on the elements (make sure to use the prop getters though! For example: `<button onBlur={handleBlur} />` should be `<button {...getToggleButtonProps({onBlur: handleBlur})} />`).

### highlightedIndex

> `number` | **control prop** (read more about this in [the Control Props section](#control-props))

The index of the item that should be highlighted when menu is open.

### isOpen

> `boolean` | **control prop** (read more about this in [the Control Props section](#control-props))

The open state of the menu.

### selectedItem

> `any` | **control prop** (read more about this in [the Control Props section](#control-props))

The item that should be selected.

### id

> `string` | defaults to a generated ID

Used to generate the first part of the `Downshift` id on the elements. Uses [@reach/auto-id][reach-auto-id] by default. You can override this `id` with one of your own, provided as a prop, or you can override the `id` for each element altogether using the props below.

### labelId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`label`) you use [`getLabelProps`](#getlabelprops) with.

### menuId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`ul`) you use [`getMenuProps`](#getmenuprops) with.

### toggleButtonId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`button`) you use [`getToggleButtonProps`](#gettogglebuttonprops) with.

### getItemId

> `function(index)` | defaults to a function that generates an ID based on the index

Used for `aria` attributes and the `id` prop of the element (`li`) you use [`getItemProps`](#getitemprops) with.

### circularNavigation

> `boolean` | defaults to `false`

Controls the circular keyboard navigation between items. If set to `true`, when first item is highlighted, the Arrow Up will move highlight to the last item, and viceversa using Arrow Down.

## stateChangeTypes

There are a few props that expose changes to state ([`onStateChange`](#onstatechange) and [`stateReducer`](#statereducer)).
For you to make the most of these APIs, it's important for you to understand why state is being changed. To accomplish this, there's a `type` property on the `changes` object you get. This `type` corresponds to a `stateChangeTypes` property.

The list of all possible values this `type` property can take is defined in [this file][state-change-file] and is as follows:

- `useSelect.stateChangeTypes.MenuKeyDownArrowDown`
- `useSelect.stateChangeTypes.MenuKeyDownArrowUp`
- `useSelect.stateChangeTypes.MenuKeyDownEscape`
- `useSelect.stateChangeTypes.MenuKeyDownHome`
- `useSelect.stateChangeTypes.MenuKeyDownEnd`
- `useSelect.stateChangeTypes.MenuKeyDownEnter`
- `useSelect.stateChangeTypes.MenuKeyDownCharacter`
- `useSelect.stateChangeTypes.MenuBlur`
- `useSelect.stateChangeTypes.ItemHover`
- `useSelect.stateChangeTypes.ItemClick`
- `useSelect.stateChangeTypes.ToggleButtonKeyDownArrowDown`
- `useSelect.stateChangeTypes.ToggleButtonKeyDownArrowUp`
- `useSelect.stateChangeTypes.ToggleButtonClick`
- `useSelect.stateChangeTypes.FunctionToggleMenu`
- `useSelect.stateChangeTypes.FunctionOpenMenu`
- `useSelect.stateChangeTypes.FunctionCloseMenu`
- `useSelect.stateChangeTypes.FunctionSetHighlightedIndex`
- `useSelect.stateChangeTypes.FunctionSetSelectedItem`
- `useSelect.stateChangeTypes.FunctionClearKeysSoFar`
- `useSelect.stateChangeTypes.FunctionReset`

See [`stateReducer`](#statereducer) for a concrete example on how to use the `type` property.

## Control Props

Downshift manages its own state internally and calls your `onChange` and `onStateChange` handlers with any relevant changes. The state that downshift manages includes: `isOpen`, `selectedItem` and `highlightedIndex`. Returned action function (read more below) can be used to manipulate this state and can likely support many of your use cases. `keysSoFar` is a special case that is used for keeping all the character keys typed at an interval smaller than 500ms. It's not something you need to bother with.

However, if more control is needed, you can pass any of these pieces of state as a prop (as indicated above) and that state becomes controlled. As soon as `this.props[statePropKey] !== undefined`, internally, `downshift` will determine its state based on your prop's value rather than its own internal state. You will be required to keep the state up to date (this is where `onStateChange` comes in really handy), but you can also control the state from anywhere, be that state from other components, `redux`, `react-router`, or anywhere else.

> Note: This is very similar to how normal controlled components work elsewhere in react (like `<input />`). If you want to learn more about this concept, you can learn about that from this the [Advanced React Component Patterns course](#advanced-react-component-patterns-course)

## Returned props

You use the hook like so:

```javascript
const {getToggleButtonProps, reset, ...rest} = useSelect({
  items: options,
  ...otherProps,
})

return (
  <div>
    <button {...getToggleButtonProps()}>Options</button>
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

> NOTE: In this example we used both a getter prop `getToggleButtonProps` and an action prop `reset`. The properties of `useSelect` can be split into three categories as indicated below:

### prop getters

> See [the blog post about prop getters][blog-post-prop-getters]

> NOTE: These prop-getters provide `aria-` attributes which are very important to your component being accessible. It's recommended that you utilize these functions and apply the props they give you to your components.

These functions are used to apply props to the elements that you render. This gives you maximum flexibility to render what, when, and wherever you like. You call these on the element in question, for example on the toggle button: `<button {...getToggleButtonProps()}`. It's advisable to pass all your props to that function rather than applying them on the element yourself to avoid your props being
overridden (or overriding the props returned). For example: `getToggleButtonProps({onKeyDown(event) {console.log(event)}})`.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property               | type              | description                                                                                    |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| `getToggleButtonProps` | `function({})`    | returns the props you should apply to any menu toggle button element you render.               |
| `getItemProps`         | `function({})`    | returns the props you should apply to any menu item elements you render.                       |
| `getLabelProps`        | `function({})`    | returns the props you should apply to the `label` element that you render.                     |
| `getMenuProps`         | `function({},{})` | returns the props you should apply to the `ul` element (or root of your menu) that you render. |

#### `getLabelProps`

This method should be applied to the `label` you render. It will generate an `id` that will be used to label the toggle button and the menu.

There are no required properties for this method.

> Note: For accessibility purposes, calling this method is highly recommended.

#### `getMenuProps`

This method should be applied to the element which contains your list of items. Typically, this will be a `<div>` or a `<ul>` that surrounds a `map` expression. This handles the proper ARIA roles and attributes.

Optional properties:

- `refKey`: if you're rendering a composite component, that component will need to accept a prop which it forwards to the root DOM element. Commonly, folks call this `innerRef`. So you'd call: `getMenuProps({refKey: 'innerRef'})` and your composite component would forward like: `<ul ref={props.innerRef} />`. However, if you are just rendering a primitive component like `<div>`, there is no need to specify this property.

Please keep in mind that menus, for accessiblity purposes, should always be rendered, regardless of whether you hide it or not. Otherwise, `getMenuProps` may throw error if you unmount and remount the menu.

- `aria-label`: By default the menu will add an `aria-labelledby` that refers to the `<label>` rendered with `getLabelProps`. However, if you provide `aria-label` to give a more specific label that describes the options available, then `aria-labelledby` will not be provided and screen readers can use your `aria-label` instead.

In some cases, you might want to completely bypass the `refKey` check. Then you can provide the object `{suppressRefError : true}` as the second argument to `getMenuProps`.
**Please use it with extreme care and only if you are absolutely sure that the ref is correctly forwarded otherwise `Downshift` will unexpectedly fail.**

```jsx
const {getMenuProps} = useSelect({items})
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

> Note that for accessibility reasons it's best if you always render this element whether or not downshift is in an `isOpen` state.

#### `getItemProps`

The props returned from calling this function should be applied to any menu items you render.

**This is an impure function**, so it should only be called when you will actually be applying the props to an item.

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

The main difference from vanilla `Downshift` is that we require the items as props before rendering. The reason is to open the menu with items already highlighted, and we need to know the items before the actual render. It is still required to pass either `item` or `index` to `getItemProps`.

- `item`: this is the item data that will be selected when the user selects a particular item.
- `index`: This is how `downshift` keeps track of your item when updating the `highlightedIndex` as the user keys around. By default, `downshift` will assume the `index` is the order in which you're calling `getItemProps`. This is often good enough, but if you find odd behavior, try setting this explicitly. It's probably best to be explicit about `index` when using a windowing library like `react-virtualized`.

Optional properties:

- `disabled`: If this is set to `true`, then all of the downshift item event handlers will be omitted. Items will not be highlighted when hovered, and items will not be selected when clicked.

#### `getToggleButtonProps`

Call this and apply the returned props to a `button`. It allows you to toggle the `Menu` component.

Optional properties:

- `disabled`: If this is set to `true`, then all of the downshift button event handlers will be omitted (it won't toggle the menu when clicked).

```jsx
const {getToggleButtonProps} = useSelect({items})
const myButton = (
  <button {...getToggleButtonProps()}>Click me</button>
  {/* menu and items */}
)
```

### actions

These are functions you can call to change the state of the downshift `useSelect` hook.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property              | type                      | description                                           |
| --------------------- | ------------------------- | ----------------------------------------------------- |
| `closeMenu`           | `function()`              | closes the menu                                       |
| `openMenu`            | `function()`              | opens the menu                                        |
| `setSelectedItem`     | `function(item: any)`     | selects the given item                                |
| `setHighlightedIndex` | `function(index: number)` | call to set a new highlighted index                   |
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
| `keysSoFar`        | `string`  | the character keys typed so far   |

### props

As a convenience, the `items` and `itemToString` props which you pass to `useSelect` are available here as well.

## Event Handlers

Downshift has a few events for which it provides implicit handlers. Several of these handlers call `event.preventDefault()`. Their additional functionality is described below.

### Default handlers

#### Toggle Button

- `Click`: If the menu is not displayed, it will open it. Otherwise it will close it. It will additionally move focus on the menu in order for screen readers to correctly narrate which item is currently highlighted. If there is already an item selected, the menu will be opened with that item already highlighted.
- `Enter`: Has the same effect as `Click`.
- `Space`: Has the same effect as `Click`.
- `ArrowDown`: If the menu is closed, it will open it. If there is already an item selected, it will open the menu with the next item (index-wise) highlighted. Otherwise, it will open the menu with the first option highlighted.
- `ArrowUp`: If the menu is closed, it will open it. If there is already an item selected, it will open the menu with the previous item (index-wise) highlighted. Otherwise, it will open the menu with the last option highlighted.

#### Menu

- `ArrowDown`: Moves `highlightedIndex` one position down. If `circularNavigation` is true, when reaching the last option, `ArrowDown` will move `highlightedIndex` to first position. Otherwise it won't change anything.
- `ArrowUp`: Moves `highlightedIndex` one position up. If `circularNavigation` is true, when reaching the first option, `ArrowUp` will move `highlightedIndex` to last position. Otherwise it won't change anything.
- `End`: Moves `highlightedIndex` to last position.
- `Home`: Moves `highlightedIndex` to first position.
- `Enter`: If there is a highlighted option, it will select it, close the menu and move focus to the toggle button (unless `defaultIsOpen` is true).
- `Escape`: It will close the menu without selecting anything and move focus to the toggle button.
- `Blur(Tab, Shift+Tab, MouseClick outside)`: If there is a highlighted option, it will select it, close the menu and move focus either to the toggle button (if `Shift+Tab`), next tabbable element (if `Tab`) or whatever was clicked.

#### Item

- `Click`: It will select the item, close the menu and move focus to the toggle button (unless `defaultIsOpen` is true).
- `MouseOver`: It will highlight the item.

### Customizing Handlers

You can provide your own event handlers to `useSelect` which will be called before the default handlers:

```javascript
const items = [...] // items here.
const {getMenuProps} = useSelect({items})
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

If you would like to prevent the default handler behavior in some cases, you can set the event's `preventDownshiftDefault` property to `true`:

```javascript
const items = [...] // items here.
const {getMenuProps} = useSelect({items})
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

If you would like to completely override Downshift's behavior for a handler, in favor of your own, you can bypass prop getters:

```javascript
const items = [...] // items here.
const {getMenuProps} = useSelect({items})
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

[select-aria]: https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
[reach-auto-id]: https://github.com/reach/reach-ui/blob/master/packages/auto-id/src/index.js
[sandbox-example]: https://codesandbox.io/s/downshift-hooks-example-ew0em
[state-change-file]: https://github.com/downshift-js/downshift/blob/master/src/hooks/useSelect/stateChangeTypes.js
[blog-post-prop-getters]: https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf
