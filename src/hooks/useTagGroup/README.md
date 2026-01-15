# useSelect

## The problem

You want to build a tag group component in your app that's accessible and offers
a great user experience. There is no dedicated ARIA design pattern for this
component, but since it's widely used, we compiled the list of specifications
and implemented them through a React hook that's compliant with Downshift's
principles.

## This solution

`useTagGroup` is a React hook that manages all the stateful logic needed to make
the tag group functional and accessible. It returns a set of props that are
meant to be called and their results destructured on the tag group's elements:
its container, tag item and tag remove button. The props are similar to the ones
provided by vanilla `<Downshift>` to the children render prop.

These props are called getter props, and their return values are destructured as
a set of ARIA attributes and event listeners. Together with the action props and
state props, they create all the stateful logic needed for the tag group to
implement the list of requirements. Every functionality needed should be
provided out-of-the-box: item removal and selection, and left/right arrow
movement between items, screen reader support etc.

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
  - [isItemDisabled](#isitemdisabled)
  - [initialSelectedItem](#initialselecteditem)
  - [initialIsOpen](#initialisopen)
  - [initialHighlightedIndex](#initialhighlightedindex)
  - [defaultSelectedItem](#defaultselecteditem)
  - [defaultIsOpen](#defaultisopen)
  - [defaultHighlightedIndex](#defaulthighlightedindex)
  - [itemToKey](#itemtokey)
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
import {useSelect} from 'downshift'

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
  const {
    addItem,
    getTagProps,
    getTagRemoveProps,
    getTagGroupProps,
    items,
    activeIndex,
  } = useTagGroup({initialItems})

  const itemsToAdd = colors.filter(color => !items.includes(color))

  return (
    <div>
      <div
        {...getTagGroupProps({'aria-label': 'colors example'})}
        style={{
          display: 'inline-flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '6px',
        }}
      >
        {items.map((color, index) => (
          <span
            key={color}
            {...getTagProps({index, 'aria-label': color})}
            style={{
              border: '1px solid darkgreen',
              backgroundColor: 'green',
              padding: '0 6px',
              margin: '0 2px',
              borderRadius: '10px',
              cursor: 'default',
              fontStyle: index === activeIndex ? 'italic' : 'normal',
            }}
          >
            {color}
            <button
              type="button"
              {...getTagRemoveProps({index, 'aria-label': 'remove'})}
              style={{
                padding: '4px',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
              }}
            >
              &#10005;
            </button>
          </span>
        ))}
      </div>

      <div>Add more items:</div>

      <ul>
        {itemsToAdd.map(item => (
          <li key={item}>
            <button
              tabIndex={0}
              onClick={() => addItem(item)}
              onKeyDown={({key}) => {
                key === 'Enter' && addItem(item)
              }}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

render(<TagGroup />, document.getElementById('root'))
```

## Basic Props

This is the list of props that you should probably know about. There are some
[advanced props](#advanced-props) below as well.

### removeElementDescription

> `string` | defaults to: `"Press Delete or Backspace to remove tag."`

An accessible description that gets added to the DOM in an invisible element and
gets picked up by screen readers when encountering tags. It should instruct
users how to remove tags with the keyboard. Useful for localized messages.

### onItemsChange

> `function(changes: object)` | optional, no useful default

Called each time the items in state changed. Adding items can be done using
`addItem`, while removing items could be done with mouse and keyboard actions.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `items` property with
  the newly selected value. This also has a `type` property which you can learn
  more about in the [`stateChangeTypes`](#statechangetypes) section. This
  property will be part of the actions that can trigger a `items` change, for
  example `useTagGroup.stateChangeTypes.FunctionAddItem`.

### stateReducer

> `function(state: object, actionAndChanges: object)` | optional

**🚨 This is a really handy power feature 🚨**

This function will be called each time `useTagGroup` sets its internal state (or
calls your `onStateChange` handler for control props). It allows you to modify
the state change that will take place which can give you fine grain control over
how the component interacts with user updates. It gives you the current state
and the state that will be set, and you return the state that you want to set.

- `state`: The full current state of useTagGroup.
- `actionAndChanges`: Object that contains the action `type`, props needed to
  return a new state based on that type and the changes suggested by the
  useTagGroup default reducer. About the `type` property you can learn more
  about in the [`stateChangeTypes`](#statechangetypes) section.

```javascript
import {useTagGroup} from 'downshift'
import {items} from './utils'

const {getTagGroupProps, getTagProps, getTagRemoveProps, ...rest} = useTagGroup(
  {
    initialItems: items.slice(0, 4),
    stateReducer,
  },
)

function stateReducer(state, actionAndChanges) {
  const {type, changes} = actionAndChanges
  // resets active item to the first when removing an item
  switch (type) {
    case useSelect.stateChangeTypes.TagGroupKeyDownBackspace:
    case useSelect.stateChangeTypes.TagGroupKeyDownDelete:
      return {
        ...changes, // default tagGroup new state changes on item removal.
        activeIndex: changes.items.length === 0 ? -1 : 0,
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
> `<button {...getTagRemoveProps({onBlur: handleBlur})} />`). Also, your reducer
> function should be "pure." This means it should do nothing other than return
> the state changes you want to have happen.

## Advanced Props

### isItemDisabled

> `function(item: any, index: number)` | defaults to: `(_item, _index) => false`

If an item needs to be marked as disabled, this function needs to return `true`
for that item. Disabled items will be skipped from keyboard navigation, will not
be removed and will be marked as disabled for screen readers.

### initialItems

> `any[]` | defaults to `null`

Pass an items collection that should be selected when useTagGroup is
initialized.

### initialActiveIndex

> `number` | defaults to `0` if there are initial items or `-1` otherwise.

Pass a boolean that sets the open state of the menu when useTagGroup is
initialized.

### onActiveIndexChange

> `function(changes: object)` | optional, no useful default

Called each time the active index was changed. Active item can be changed by
clicking the tag or by using left and right arrows while a tag is focused.

- `changes`: These are the properties that actually have changed since the last
  state change. This object is guaranteed to contain the `activeIndex` property
  with the new value. This also has a `type` property which you can learn more
  about in the [`stateChangeTypes`](#statechangetypes) section. This property
  will be part of the actions that can trigger a `activeIndex` change, for
  example `useTagGroup.stateChangeTypes.TagGroupKeyDownArrowRight`.

### onStateChange

> `function(changes: object)` | optional, no useful default

This function is called anytime the internal state changes. This can be useful
if you're using useTagGroup as a "controlled" hook, where you manage some or all
of the state (e.g., isOpen, selectedItem, highlightedIndex, etc) and then pass
it as props, rather than letting useTagGroup control all its state itself.

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
> For example: `<span onBlur={handleBlur} />` should be
> `<span {...getTagProps({onBlur: handleBlur})} />`).

### activeIndex

> `number` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The index of the item that should be active so that it receives focus.

### items

> `any[]` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The items that are part of the tag group

### id

> `string` | defaults to a generated ID

Used to generate the first part of the useTagGroup id on the elements. You can
override this `id` with one of your own, provided as a prop, or you can override
the `id` for each element altogether using the props below.

### tagGroupId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element you use
[`getTagGroupProps`](#gettaggroupprops) with.

### getTagId

> `function(index)` | defaults to a function that generates an ID based on the
> index

Used for `aria` attributes and the `id` prop of the element (`li`) you use
[`getTagProps`](#gettagprops) and [`getTagRemoveProps`](#gettagremoveprops)
with.

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

- `useTagGroup.stateChangeTypes.TagClick`
- `useTagGroup.stateChangeTypes.TagGroupKeyDownArrowLeft`
- `useTagGroup.stateChangeTypes.TagGroupKeyDownArrowRight`
- `useTagGroup.stateChangeTypes.TagGroupKeyDownBackspace`
- `useTagGroup.stateChangeTypes.TagGroupKeyDownDelete`
- `useTagGroup.stateChangeTypes.TagRemoveClick`
- `useTagGroup.stateChangeTypes.FunctionAddItem`

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
> can learn about that from the [Advanced React Component Patterns
> course][advanced-react-component-patterns-course]

## Returned props

You use the hook like so:

```javascript
import {useTagGroup} from 'downshift'
import {items} from './utils'

const {getTagGroupProps, addItem, ...rest} = useTagGroup({
  initialItems: items.slice(0, 2),
  ...otherProps,
})

return (
  <div>
    <div {...getTagGroupProps()}>{/* render the items */}</div>
    <div>
      {/* render items to be added */}
      <button
        onClick={() => {
          addItem(itemToBeAdded)
        }}
      >
        {`Add ${itemToBeAdded.title}`}
      </button>
    </div>
  </div>
)
```

> NOTE: In this example we used both a getter prop `getTagGroupProps` and an
> action prop `addItem`. The properties of `useTagGroup` can be split into three
> categories as indicated below:

### prop getters

> See [the blog post about prop getters][blog-post-prop-getters]

> NOTE: These prop-getters provide `aria-` attributes which are very important
> to your component being accessible. It's recommended that you utilize these
> functions and apply the props they give you to your components.

These functions are used to apply props to the elements that you render. This
gives you maximum flexibility to render what, when, and wherever you like. You
call these on the element in question, for example on the toggle button:
`<button {...getTagRemoveProps()}`. It's advisable to pass all your props to
that function rather than applying them on the element yourself to avoid your
props being overridden (or overriding the props returned). For example:
`getTagRemoveProps({onKeyDown(event) {console.log(event)}})`.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property            | type           | description                                                                          |
| ------------------- | -------------- | ------------------------------------------------------------------------------------ |
| `getTagGroupProps`  | `function({})` | returns the props you should apply to the tag group container element you render.    |
| `getTagProps`       | `function({})` | returns the props you should apply to any tag elements you render.                   |
| `getTagRemoveProps` | `function({})` | returns the props you should apply to the tag remove button element that you render. |
|                     |

#### `getTagGroupProps`

This method should be applied to the tag group container you render. It applies
a `listbox` role along with some other ARIA properties and event handlers.

#### `getTagProps`

This method should be applied to the tag element that makes up the list of tags
in the tag group. Typically, this will be a `<span>` or a `<div>`. This applies
ARIA attributes and event handlers.

Required properties:

- `index`: This is how `useTagRemoveGroup` keeps track of your item when
  changing the active element through `activeIndex`. By default,
  `useTagRemoveGroup` will assume the `index` is the order in which you're
  calling `getTagProps`. This is often good enough, but if you find odd
  behavior, try setting this explicitly. It's probably best to be explicit about
  `index` when using a windowing library like `react-virtualized`.

Optional properties:

- `ref`: if you need to access the menu element via a ref object, you'd call the
  function like this: `getTagProps({ref: yourTagRef})`. As a result, the tag
  element will receive a composed `ref` property, which guarantees that both
  your code and `useTagGroup` use the same correct reference to the element.

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getTagProps({refKey: 'innerRef'})` and
  your composite component would forward like: `<span ref={props.innerRef} />`.
  However, if you are just rendering a primitive component like `<div>`, there
  is no need to specify this property. It defaults to `ref`.

In some cases, you might want to completely bypass the `refKey` check. Then you
can provide the object `{suppressRefError : true}` as the second argument to
`getTagProps`. **Please use it with extreme care and only if you are absolutely
sure that the ref is correctly forwarded otherwise `useTagGroup` will
unexpectedly fail.**

```jsx
const {getTagProps, getTagGroupProps, items} = useTagGroup()
const ui = (
  <div {...getTagGroupProps()}>
    {!items.length === 0
      ? null
      : items.map((item, index) => (
          <span {...getTagProps({index, key: item.id})}>{item.name}</span>
        ))}
  </div>
)
```

**This is an impure function**, so it should only be called when you will
actually be applying the props to an item.

<details>

<summary>What do you mean by impure function?</summary>

Basically just don't do this:

```jsx
items.map((item, index) => {
  const props = getTagProps({item, index}) // we're calling it here
  if (!shouldRenderItem(item)) {
    return null // but we're not using props, and downshift thinks we are...
  }
  return <div {...props} />
})
```

Instead, you could do this:

```jsx
items.filter(shouldRenderItem).map(item => <div {...getTagProps({item})} />)
```

</details>

#### `getTagRemoveProps`

The props returned from calling this function should be applied to the remove
button element for each tag, if there is need for such an element

**This is an impure function**, same as `getTagProps`.

```jsx
// rendering the tag
<span {...getTagProps({index, key: item.id})}>
  {item.name}
  <button {...getTagRemoveProps({index, 'aria-label': 'Remove'})}>X</button>
</span>
```

Required properties:

- `index`: This is how `useTagRemoveGroup` keeps track of your item when
  labelling the remove button. By default, `useTagRemoveGroup` will assume the
  `index` is the order in which you're calling `getItemProps`. This is often
  good enough, but if you find odd behavior, try setting this explicitly. It's
  probably best to be explicit about `index` when using a windowing library like
  `react-virtualized`.

Optional properties:

- `ref`: if you need to access the item element via a ref object, you'd call the
  function like this: `getTagRemoveProps({ref: yourTagRef})`. As a result, the
  tag element will receive a composed `ref` property, which guarantees that both
  your code and `useSelect` use the same correct reference to the element.

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getTagRemoveProps({refKey: 'innerRef'})`
  and your composite component would forward like:
  `<button ref={props.innerRef} />`. However, if you are just rendering a
  primitive component like `<div>`, there is no need to specify this property.
  It defaults to `ref`.

### actions

These are functions you can call to change the state of the downshift
`useTagGroup` hook.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property  | type                  | description                              |
| --------- | --------------------- | ---------------------------------------- |
| `addItem` | `function(item: any)` | it adds the given item to the collection |

### state

These are values that represent the current state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property      | type     | description                |
| ------------- | -------- | -------------------------- |
| `activeIndex` | `number` | the currently active item  |
| `items`       | `any[]`  | the items in the selection |

## Event Handlers

Downshift has a few events for which it provides implicit handlers. Several of
these handlers call `event.preventDefault()`. Their additional functionality is
described below.

### Default handlers

#### Toggle Button

- `Click`: If the menu is not displayed, it will open it. Otherwise it will
  close it. If there is already an item selected, the menu will be opened with
  that item already highlighted.
- `Enter`: If the menu is closed, opens the menu. If the menu is opened and
  there is an item highlighted, it will select that item.
- `Space`: If the menu is closed, opens the menu. If the menu is opened and
  there is an item highlighted, it will select that item. If the user has typed
  character keys before pressing `Space`, the space character will concatenate
  to the search query. This allows search for options such as `Republic of ..`.
- `CharacterKey`: Opens the menu if closed and highlights the first option that
  starts with that key. For instance, typing `C` will select the option that
  starts with `C`. Pressing `C` again will move the highlight to the next item
  that starts with `C`. Typing keys into rapid succession (in less than 500ms
  each) will select the option starting with that key combination, for instance
  typing `CAL` will select `californium` if this option exists.
- `ArrowDown`: If the menu is closed, it will open it. If there is already an
  item selected, it will open the menu with the selected item highlighted.
  Otherwise, it will open the menu with the first option highlighted. If the
  menu is already open, it will highlight the next item.
- `ArrowUp`: If the menu is closed, it will open it. If there is already an item
  selected, it will open the menu with the selected item highlighted. Otherwise,
  it will open the menu with the last option highlighted. If the menu is already
  open, it will highlight the previous item.
- `Alt+ArrowDown`: If the menu is closed, it will open it, without highlighting
  any item.
- `Alt+ArrowUp`: If the menu is open, it will close it and will select the item
  that was highlighted.
- `End`: If the menu is closed, it will open it. It will also highlight the last
  item in the list.
- `Home`: If the menu is closed, it will open it. It will also highlight the
  first item in the list.
- `PageUp`: If the menu is open, it will move the highlight the item 10
  positions before the current selection.
- `PageDown`: If the menu is open, it will move the highlight the item 10
  positions after the current selection.
- `Escape`: It will close the menu without selecting anything and keeps focus to
  the toggle button.
- `Blur(Tab, Shift+Tab, MouseClick outside)`: It will close the menu will select
  the highlighted item if any. Focus is handled naturally (next / previous
  elemenent in the tab order, body element if click outside.).

#### Menu

- `MouseLeave`: Will clear the value of the `highlightedIndex` if it was set.

#### Item

- `Click`: It will select the item and close the menu.
- `MouseOver`: It will highlight the item.

#### Label

- `Click`: It will move focus to the toggle element.

### Customizing Handlers

You can provide your own event handlers to `useSelect` which will be called
before the default handlers:

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

If you would like to prevent the default handler behavior in some cases, you can
set the event's `preventDownshiftDefault` property to `true`:

```javascript
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

If you would like to completely override Downshift's behavior for a handler, in
favor of your own, you can bypass prop getters:

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

## Examples

Usage examples are kept on the [downshift docsite][docsite] and also on [the
sandbox repo][sandbox-repo]. Each example has a link to its own Codesandbox
version, so check the docs.

It can be a great contributing opportunity to provide relevant use cases as
docsite examples. If you have such an example, please create an issue with the
suggestion and the Codesandbox for it, and we will take it from there.

[select-aria]:
  https://w3c.github.io/aria-practices/examples/combobox/combobox-select-only.html
[sandbox-example]:
  https://codesandbox.io/p/sandbox/github/kentcdodds/downshift-examples?file=%2Fsrc%2Fhooks%2FuseSelect%2Fbasic-usage.js&moduleview=1
[state-change-file]:
  https://github.com/downshift-js/downshift/blob/master/src/hooks/useSelect/stateChangeTypes.js
[blog-post-prop-getters]:
  https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf
[docsite]: https://downshift-js.com/
[sandbox-repo]:
  https://codesandbox.io/p/sandbox/github/kentcdodds/downshift-examples?file=%2Fsrc%2Findex.js&moduleview=1
[advanced-react-component-patterns-course]:
  https://github.com/downshift-js/downshift#advanced-react-component-patterns-course
[migration-guide-v7]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/MIGRATION_V7.md#useselect
[migration-guide-v8]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/MIGRATION_V8.md
[migration-guide-v9]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/MIGRATION_V9.md
