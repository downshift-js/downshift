<h1 align="center">
  downshift 🏎
  <br>
  <img src="https://cdn.rawgit.com/downshift-js/downshift/d9e94139/other/logo/downshift.svg" alt="downshift logo" title="downshift logo" width="300">
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">Primitives to build simple, flexible, WAI-ARIA compliant React
autocomplete/dropdown/select/combobox components</p>

> See
> [the intro blog post](https://blog.kentcdodds.com/introducing-downshift-for-react-b1de3fca0817) and
> [Episode
> 79 of the Full Stack Radio podcast](https://simplecast.com/s/f2e65eaf)

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![downloads][downloads-badge]][npmcharts] [![version][version-badge]][package]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-104-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Chat][chat-badge]][chat]
[![Code of Conduct][coc-badge]][coc]
[![Join the community on Spectrum][spectrum-badge]][spectrum]

[![Supports React and Preact][react-badge]][react]
[![size][size-badge]][unpkg-dist] [![gzip size][gzip-badge]][unpkg-dist]
[![module formats: umd, cjs, and es][module-formats-badge]][unpkg-dist]

## The problem

You need an autocomplete/dropdown/select experience in your application and you
want it to be accessible. You also want it to be simple and flexible to account
for your use cases.

## This solution

This is a component that controls user interactions and state for you so you can
create autocomplete/dropdown/select/etc. components. It uses a [render
prop][use-a-render-prop] which gives you maximum flexibility with a minimal API
because you are responsible for the rendering of everything and you simply apply
props to what you're rendering.

This differs from other solutions which render things for their use case and
then expose many options to allow for extensibility resulting in a bigger API
that is less flexible as well as making the implementation more complicated and
harder to contribute to.

> NOTE: The original use case of this component is autocomplete, however the API
> is powerful and flexible enough to build things like dropdowns as well.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Basic Props](#basic-props)
  - [children](#children)
  - [itemToString](#itemtostring)
  - [onChange](#onchange)
  - [stateReducer](#statereducer)
- [Advanced Props](#advanced-props)
  - [initialSelectedItem](#initialselecteditem)
  - [initialInputValue](#initialinputvalue)
  - [initialHighlightedIndex](#initialhighlightedindex)
  - [initialIsOpen](#initialisopen)
  - [defaultHighlightedIndex](#defaulthighlightedindex)
  - [defaultIsOpen](#defaultisopen)
  - [selectedItemChanged](#selecteditemchanged)
  - [getA11yStatusMessage](#geta11ystatusmessage)
  - [onSelect](#onselect)
  - [onStateChange](#onstatechange)
  - [onInputValueChange](#oninputvaluechange)
  - [itemCount](#itemcount)
  - [highlightedIndex](#highlightedindex)
  - [inputValue](#inputvalue)
  - [isOpen](#isopen)
  - [selectedItem](#selecteditem)
  - [id](#id)
  - [inputId](#inputid)
  - [labelId](#labelid)
  - [menuId](#menuid)
  - [getItemId](#getitemid)
  - [environment](#environment)
  - [onOuterClick](#onouterclick)
  - [scrollIntoView](#scrollintoview)
- [stateChangeTypes](#statechangetypes)
- [Control Props](#control-props)
- [Children Function](#children-function)
  - [prop getters](#prop-getters)
  - [actions](#actions)
  - [state](#state)
  - [props](#props)
- [Event Handlers](#event-handlers)
  - [default handlers](#default-handlers)
  - [customizing handlers](#customizing-handlers)
- [Utilities](#utilities)
  - [resetIdCounter](#resetidcounter)
- [React Native](#react-native)
  - [Gotchas](#gotchas)
- [Advanced React Component Patterns course](#advanced-react-component-patterns-course)
- [Examples](#examples)
- [FAQ](#faq)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Bindings for ReasonML](#bindings-for-reasonml)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save downshift
```

> This package also depends on `react` and `prop-types`. Please make sure you
> have those installed as well.

> Note also this library supports `preact` out of the box. If you are using
> `preact` then use the corresponding module in the `preact/dist` folder. You
> can even `import Downshift from 'downshift/preact'` 👍

## Usage

> [Try it out in the browser](https://codesandbox.io/s/6z67jvklw3)

```jsx
import React from 'react'
import {render} from 'react-dom'
import Downshift from 'downshift'

const items = [
  {value: 'apple'},
  {value: 'pear'},
  {value: 'orange'},
  {value: 'grape'},
  {value: 'banana'},
]

render(
  <Downshift
    onChange={selection => alert(`You selected ${selection.value}`)}
    itemToString={item => (item ? item.value : '')}
  >
    {({
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
    }) => (
      <div>
        <label {...getLabelProps()}>Enter a fruit</label>
        <input {...getInputProps()} />
        <ul {...getMenuProps()}>
          {isOpen
            ? items
                .filter(item => !inputValue || item.value.includes(inputValue))
                .map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {item.value}
                  </li>
                ))
            : null}
        </ul>
      </div>
    )}
  </Downshift>,
  document.getElementById('root'),
)
```

`<Downshift />` is the only component exposed by this package. It doesn't render
anything itself, it just calls the render function and renders that.
["Use a render prop!"][use-a-render-prop]!
`<Downshift>{downshift => <div>/* your JSX here! */</div>}</Downshift>`.

## Basic Props

This is the list of props that you should probably know about. There are some
[advanced props](#advanced-props) below as well.

### children

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Children Function](#children-function)".

### itemToString

> `function(item: any)` | defaults to: `i => (i == null ? '' : String(i))`

Used to determine the string value for the selected item (which is used to
compute the `inputValue`).

### onChange

> `function(selectedItem: any, stateAndHelpers: object)` | optional, no useful
> default

Called when the user selects an item and the selected item has changed. Called
with the item that was selected and the new state of `downshift`. (see
`onStateChange` for more info on `stateAndHelpers`).

- `selectedItem`: The item that was just selected
- `stateAndHelpers`: This is the same thing your `children` function is
  called with (see [Children Function](#children-function))

### stateReducer

> `function(state: object, changes: object)` | optional

**🚨 This is a really handy power feature 🚨**

This function will be called each time `downshift` sets its internal state
(or calls your `onStateChange` handler for control props). It allows you to
modify the state change that will take place which can give you fine grain
control over how the component interacts with user updates without having to
use [Control Props](#control-props). It gives you the current state and the
state that will be set, and you return the state that you want to set.

- `state`: The full current state of downshift.
- `changes`: These are the properties that are about to change. This also has a
  `type` property which you can learn more about in the
  [`stateChangeTypes`](#statechangetypes) section.

```jsx
const ui = (
  <Downshift stateReducer={stateReducer}>{/* your callback */}</Downshift>
)

function stateReducer(state, changes) {
  // this prevents the menu from being closed when the user
  // selects an item with a keyboard or mouse
  switch (changes.type) {
    case Downshift.stateChangeTypes.keyDownEnter:
    case Downshift.stateChangeTypes.clickItem:
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

> NOTE: This is only called when state actually changes. You should not attempt
> to use this to handle events. If you wish to handle events, put your event
> handlers directly on the elements (make sure to use the prop getters though!
> For example: `<input onBlur={handleBlur} />` should be
> `<input {...getInputProps({onBlur: handleBlur})} />`). Also, your reducer
> function should be "pure." This means it should do nothing other than return
> the state changes you want to have happen.

## Advanced Props

### initialSelectedItem

> `any` | defaults to `null`

Pass an item or an array of items that should be selected when downshift is initialized.

### initialInputValue

> `string` | defaults to `''`

This is the initial input value when downshift is initialized.

### initialHighlightedIndex

> `number`/`null` | defaults to `defaultHighlightedIndex`

This is the initial value to set the highlighted index to when downshift is initialized.

### initialIsOpen

> `boolean` | defaults to `defaultIsOpen`

This is the initial `isOpen` value when downshift is initialized.

### defaultHighlightedIndex

> `number`/`null` | defaults to `null`

This is the value to set the `highlightedIndex` to anytime downshift is reset,
when the the selection is cleared, or when an item is selected.

### defaultIsOpen

> `boolean` | defaults to `false`

This is the value to set the `isOpen` to anytime downshift is reset, when the
the selection is cleared, or when an item is selected.

### selectedItemChanged

> `function(prevItem: any, item: any)` | defaults to: `(prevItem, item) => (prevItem !== item)`

Used to determine if the new `selectedItem` has changed compared to the previous
`selectedItem` and properly update Downshift's internal state.

### getA11yStatusMessage

> `function({/* see below */})` | default messages provided in English

This function is passed as props to a `Status` component nested within and
allows you to create your own assertive ARIA statuses.

A default `getA11yStatusMessage` function is provided that will check
`resultCount` and return "No results." or if there are results but no item is
highlighted, "`resultCount` results are available, use up and down arrow keys to
navigate." If an item is highlighted it will run `itemToString(highlightedItem)`
and display the value of the `highlightedItem`.

The object you are passed to generate your status message has the following
properties:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property              | type            | description                                                                                  |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `highlightedIndex`    | `number`/`null` | The currently highlighted index                                                              |
| `highlightedItem`     | `any`           | The value of the highlighted item                                                            |
| `inputValue`          | `string`        | The current input value                                                                      |
| `isOpen`              | `boolean`       | The `isOpen` state                                                                           |
| `itemToString`        | `function(any)` | The `itemToString` function (see props) for getting the string value from one of the options |
| `previousResultCount` | `number`        | The total items showing in the dropdown the last time the status was updated                 |
| `resultCount`         | `number`        | The total items showing in the dropdown                                                      |
| `selectedItem`        | `any`           | The value of the currently selected item                                                     |

### onSelect

> `function(selectedItem: any, stateAndHelpers: object)` | optional, no useful
> default

Called when the user selects an item, regardless of the previous selected item.
Called with the item that was selected and the new state of `downshift`. (see
`onStateChange` for more info on `stateAndHelpers`).

- `selectedItem`: The item that was just selected
- `stateAndHelpers`: This is the same thing your `children` function is
  called with (see [Children Function](#children-function))

### onStateChange

> `function(changes: object, stateAndHelpers: object)` | optional, no useful
> default

This function is called anytime the internal state changes. This can be useful
if you're using downshift as a "controlled" component, where you manage some or
all of the state (e.g. isOpen, selectedItem, highlightedIndex, etc) and then
pass it as props, rather than letting downshift control all its state itself.
The parameters both take the shape of internal state (`{highlightedIndex: number, inputValue: string, isOpen: boolean, selectedItem: any}`) but differ
slightly.

- `changes`: These are the properties that actually have changed since the last
  state change. This also has a `type` property which you can learn more about
  in the [`stateChangeTypes`](#statechangetypes) section.
- `stateAndHelpers`: This is the exact same thing your `children` function is
  called with (see [Children Function](#children-function))

> Tip: This function will be called any time _any_ state is changed. The best
> way to determine whether any particular state was changed, you can use
> `changes.hasOwnProperty('propName')`.

> NOTE: This is only called when state actually changes. You should not attempt
> to use this to handle events. If you wish to handle events, put your event
> handlers directly on the elements (make sure to use the prop getters though!
> For example: `<input onBlur={handleBlur} />` should be
> `<input {...getInputProps({onBlur: handleBlur})} />`).

### onInputValueChange

> `function(inputValue: string, stateAndHelpers: object)` | optional, no useful
> default

Called whenever the input value changes. Useful to use instead or in combination
of `onStateChange` when `inputValue` is a controlled prop to
[avoid issues with cursor positions](https://github.com/downshift-js/downshift/issues/217).

- `inputValue`: The current value of the input
- `stateAndHelpers`: This is the same thing your `children` function is
  called with (see [Children Function](#children-function))

### itemCount

> `number` | optional, defaults the number of times you call getItemProps

This is useful if you're using some kind of virtual listing component for
"windowing" (like
[`react-virtualized`](https://github.com/bvaughn/react-virtualized)).

### highlightedIndex

> `number` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The index that should be highlighted

### inputValue

> `string` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The value the input should have

### isOpen

> `boolean` | **control prop** (read more about this in
> [the Control Props section](#control-props))

Whether the menu should be considered open or closed. Some aspects of the
downshift component respond differently based on this value (for example, if
`isOpen` is true when the user hits "Enter" on the input field, then the item at
the `highlightedIndex` item is selected).

### selectedItem

> `any`/`Array(any)` | **control prop** (read more about this in
> [the Control Props section](#control-props))

The currently selected item.

### id

> `string` | defaults to a generated ID

You should not normally need to set this prop. It's only useful if you're server
rendering items (which each have an `id` prop generated based on the `downshift`
`id`). For more information see the `FAQ` below.

### inputId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`input`) you use
[`getInputProps`](#getinputprops) with.

### labelId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`label`) you use
[`getLabelProps`](#getlabelprops) with.

### menuId

> `string` | defaults to a generated ID

Used for `aria` attributes and the `id` prop of the element (`ul`) you use
[`getMenuProps`](#getmenuprops) with.

### getItemId

> `function(index)` | defaults to a function that generates an ID based on the index

Used for `aria` attributes and the `id` prop of the element (`li`) you use
[`getInputProps`](#getinputprops) with.

### environment

> `window` | defaults to `window`

This prop is only useful if you're rendering downshift within a different `window` context from where your JavaScript is running; for example, an iframe or a shadow-root. If the given context is lacking `document` and/or `add|removeEventListener` on its prototype (as is the case for a shadow-root) then you will need to pass in a custom object that is able to provide [access to these properties](https://gist.github.com/Rendez/1dd55882e9b850dd3990feefc9d6e177) for downshift.

### onOuterClick

> `function(stateAndHelpers: object)` | optional

A helper callback to help control internal state of downshift like `isOpen` as
mentioned in [this issue](https://github.com/downshift-js/downshift/issues/206). The
same behavior can be achieved using `onStateChange`, but this prop is provided
as a helper because it's a fairly common use-case if you're controlling the
`isOpen` state:

```jsx
const ui = (
  <Downshift
    isOpen={this.state.menuIsOpen}
    onOuterClick={() => this.setState({menuIsOpen: false})}
  >
    {/* your callback */}
  </Downshift>
)
```

This callback will only be called if `isOpen` is `true`.

### scrollIntoView

> `function(node: HTMLElement, menuNode: HTMLElement)` | defaults to internal
> implementation

This allows you to customize how the scrolling works when the highlighted index
changes. It receives the node to be scrolled to and the root node (the root
node you render in downshift). Internally we use
[`compute-scroll-into-view`](https://www.npmjs.com/package/compute-scroll-into-view)
so if you use that package then you wont be adding any additional bytes to your
bundle :)

## stateChangeTypes

There are a few props that expose changes to state
([`onStateChange`](#onstatechange) and [`stateReducer`](#statereducer)).
For you to make the most of these APIs, it's important for you to understand
why state is being changed. To accomplish this, there's a `type` property on the
`changes` object you get. This `type` corresponds to a
`Downshift.stateChangeTypes` property.

The list of all possible values this `type` property can take is defined in
[this file](https://github.com/downshift-js/downshift/blob/master/src/stateChangeTypes.js)
and is as follows:

- `Downshift.stateChangeTypes.unknown`
- `Downshift.stateChangeTypes.mouseUp`
- `Downshift.stateChangeTypes.itemMouseEnter`
- `Downshift.stateChangeTypes.keyDownArrowUp`
- `Downshift.stateChangeTypes.keyDownArrowDown`
- `Downshift.stateChangeTypes.keyDownEscape`
- `Downshift.stateChangeTypes.keyDownEnter`
- `Downshift.stateChangeTypes.clickItem`
- `Downshift.stateChangeTypes.blurInput`
- `Downshift.stateChangeTypes.changeInput`
- `Downshift.stateChangeTypes.keyDownSpaceButton`
- `Downshift.stateChangeTypes.clickButton`
- `Downshift.stateChangeTypes.blurButton`
- `Downshift.stateChangeTypes.controlledPropUpdatedSelectedItem`
- `Downshift.stateChangeTypes.touchEnd`

See [`stateReducer`](#statereducer) for a concrete example on how to use the
`type` property.

## Control Props

downshift manages its own state internally and calls your `onChange` and
`onStateChange` handlers with any relevant changes. The state that downshift
manages includes: `isOpen`, `selectedItem`, `inputValue`, and
`highlightedIndex`. Your Children function (read more below) can be used to
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

## Children Function

This is where you render whatever you want to based on the state of `downshift`.
You use it like so:

```javascript
const ui = (
  <Downshift>
    {downshift => (
      // use downshift utilities and state here, like downshift.isOpen,
      // downshift.getInputProps, etc.
      <div>{/* more jsx here */}</div>
    )}
  </Downshift>
)
```

The properties of this `downshift` object can be split into three categories as
indicated below:

### prop getters

> See
> [the blog post about prop getters](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf)

> NOTE: These prop-getters provide important `aria-` attributes which are very
> important to your component being accessible. It's recommended that you
> utilize these functions and apply the props they give you to your components.

These functions are used to apply props to the elements that you render. This
gives you maximum flexibility to render what, when, and wherever you like. You
call these on the element in question (for example: `<input {...getInputProps()}`)). It's advisable to pass all your props to that function
rather than applying them on the element yourself to avoid your props being
overridden (or overriding the props returned). For example:
`getInputProps({onKeyUp(event) {console.log(event)}})`.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property               | type              | description                                                                                    |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| `getToggleButtonProps` | `function({})`    | returns the props you should apply to any menu toggle button element you render.               |
| `getInputProps`        | `function({})`    | returns the props you should apply to the `input` element that you render.                     |
| `getItemProps`         | `function({})`    | returns the props you should apply to any menu item elements you render.                       |
| `getLabelProps`        | `function({})`    | returns the props you should apply to the `label` element that you render.                     |
| `getMenuProps`         | `function({},{})` | returns the props you should apply to the `ul` element (or root of your menu) that you render. |
| `getRootProps`         | `function({},{})` | returns the props you should apply to the root element that you render. It can be optional.    |

#### `getRootProps`

<details>

<summary>If you cannot render a div as the root element, then read this</summary>

Most of the time, you can just render a `div` yourself and `Downshift` will
apply the props it needs to do its job (and you don't need to call this
function). However, if you're rendering a composite component (custom component)
as the root element, then you'll need to call `getRootProps` and apply that to
your root element (downshift will throw an error otherwise).

There are no required properties for this method.

Optional properties:

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getRootProps({refKey: 'innerRef'})` and
  your composite component would forward like: `<div ref={props.innerRef} />`

If you're rendering a composite component, `Downshift` checks that
`getRootProps` is called and that `refKey` is a prop of the returned composite
component. This is done to catch common causes of errors but, in some cases, the
check could fail even if the ref is correctly forwarded to the root DOM
component. In these cases, you can provide the object `{suppressRefError : true}` as the second argument to `getRootProps` to completely bypass the check.\
**Please use it with extreme care and only if you are absolutely sure that the ref
is correctly forwarded otherwise `Downshift` will unexpectedly fail.**\
See [#235](https://github.com/downshift-js/downshift/issues/235) for the discussion that lead to this.

</details>

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

#### `getLabelProps`

This method should be applied to the `label` you render. It is useful for
ensuring that the `for` attribute on the `<label>` (`htmlFor` as a react prop)
is the same as the `id` that appears on the `input`. If no `htmlFor` is provided
(the normal case) then an ID will be generated and used for the `input` and the
`label` `for` attribute.

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
  is no need to specify this property.

  Please keep in mind that menus, for accessiblity purposes, should always be
  rendered, regardless of whether you hide it or not. Otherwise, `getMenuProps`
  may throw error if you unmount and remount the menu.

- `aria-label`: By default the menu will add an `aria-labelledby` that refers
  to the `<label>` rendered with `getLabelProps`. However, if you provide
  `aria-label` to give a more specific label that describes the options
  available, then `aria-labelledby` will not be provided and screen readers
  can use your `aria-label` instead.

In some cases, you might want to completely bypass the `refKey` check. Then you
can provide the object `{suppressRefError : true}` as the second argument to
`getMenuProps`.
**Please use it with extreme care and only if you are absolutely sure that the ref
is correctly forwarded otherwise `Downshift` will unexpectedly fail.**

```jsx
<ul {...getMenuProps()}>
  {!isOpen
    ? null
    : items.map((item, index) => (
        <li {...getItemProps({item, index, key: item.id})}>{item.name}</li>
      ))}
</ul>
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
items.map(item => {
  const props = getItemProps({item}) // we're calling it here
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

- `item`: this is the item data that will be selected when the user selects a
  particular item.

Optional properties:

- `index`: This is how `downshift` keeps track of your item when updating the
  `highlightedIndex` as the user keys around. By default, `downshift` will
  assume the `index` is the order in which you're calling `getItemProps`. This
  is often good enough, but if you find odd behavior, try setting this
  explicitly. It's probably best to be explicit about `index` when using a
  windowing library like `react-virtualized`.
- `disabled`: If this is set to `true`, then all of the downshift item event
  handlers will be omitted. Items will not be highlighted when hovered,
  and items will not be selected when clicked.

#### `getToggleButtonProps`

Call this and apply the returned props to a `button`. It allows you to toggle
the `Menu` component. You can definitely build something like this yourself (all
of the available APIs are exposed to you), but this is nice because it will also
apply all of the proper ARIA attributes.

Optional properties:

- `disabled`: If this is set to `true`, then all of the downshift button event
  handlers will be omitted (it wont toggle the menu when clicked).
- `aria-label`: The `aria-label` prop is in English. You should probably override
  this yourself so you can provide translations:

```jsx
const myButton = (
  <button
    {...getToggleButtonProps({
      'aria-label': translateWithId(isOpen ? 'close.menu' : 'open.menu'),
    })}
  />
)
```

### actions

These are functions you can call to change the state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property                | type                                                             | description                                                                                                                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clearSelection`        | `function(cb: Function)`                                         | clears the selection                                                                                                                                                                                                                                                   |
| `clearItems`            | `function()`                                                     | Clears downshift's record of all the items. Only really useful if you render your items asynchronously within downshift. See [#186](https://github.com/downshift-js/downshift/issues/186)                                                                              |
| `closeMenu`             | `function(cb: Function)`                                         | closes the menu                                                                                                                                                                                                                                                        |
| `openMenu`              | `function(cb: Function)`                                         | opens the menu                                                                                                                                                                                                                                                         |
| `selectHighlightedItem` | `function(otherStateToSet: object, cb: Function)`                | selects the item that is currently highlighted                                                                                                                                                                                                                         |
| `selectItem`            | `function(item: any, otherStateToSet: object, cb: Function)`     | selects the given item                                                                                                                                                                                                                                                 |
| `selectItemAtIndex`     | `function(index: number, otherStateToSet: object, cb: Function)` | selects the item at the given index                                                                                                                                                                                                                                    |
| `setHighlightedIndex`   | `function(index: number, otherStateToSet: object, cb: Function)` | call to set a new highlighted index                                                                                                                                                                                                                                    |
| `toggleMenu`            | `function(otherStateToSet: object, cb: Function)`                | toggle the menu open state                                                                                                                                                                                                                                             |
| `reset`                 | `function(otherStateToSet: object, cb: Function)`                | this resets downshift's state to a reasonable default                                                                                                                                                                                                                  |
| `setItemCount`          | `function(count: number)`                                        | this sets the `itemCount`. Handy in situations where you're using windowing and the items are loaded asynchronously from within downshift (so you can't use the `itemCount` prop.                                                                                      |
| `unsetItemCount`        | `function()`                                                     | this unsets the `itemCount` which means the item count will be calculated instead by the `itemCount` prop or based on how many times you call `getItemProps`.                                                                                                          |
| `setState`              | `function(stateToSet: object, cb: Function)`                     | This is a general `setState` function. It uses downshift's `internalSetState` function which works with control props and calls your `onSelect`, `onChange`, etc. (Note, you can specify a `type` which you can reference in some other APIs like the `stateReducer`). |

> `otherStateToSet` refers to an object to set other internal state. It is
> recommended to avoid abusing this, but is available if you need it.

### state

These are values that represent the current state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property           | type              | description                                    |
| ------------------ | ----------------- | ---------------------------------------------- |
| `highlightedIndex` | `number` / `null` | the currently highlighted item                 |
| `inputValue`       | `string` / `null` | the current value of the `getInputProps` input |
| `isOpen`           | `boolean`         | the menu open state                            |
| `selectedItem`     | `any`             | the currently selected item input              |

### props

As a convenience, the `id` and `itemToString` props which you pass to
`<Downshift />` are available here as well.

## Event Handlers

Downshift has a few events for which it provides implicit handlers. Several of
these handlers call `event.preventDefault()`. Their additional functionality is
described below.

### default handlers

- `ArrowDown`: if menu is closed, opens it and moves the highlighted index to
  `defaultHighlightedIndex + 1`, if `defaultHighlightedIndex` is provided, or
  to the top-most item, if not. If menu is open, it moves the highlighted index
  down by 1. If the shift key is held when this event fires, the highlighted
  index will jump down 5 indices instead of 1. NOTE: if the current highlighed
  index is within the bottom 5 indices, the top-most index will be highlighted.)

- `ArrowUp`: if menu is closed, opens it and moves the highlighted index to
  `defaultHighlightedIndex - 1`, if `defaultHighlightedIndex` is provided, or
  to the bottom-most item, if not. If menu is open, moves the highlighted index
  up by 1. If the shift key is held when this event fires, the highlighted
  index will jump up 5 indices instead of 1. NOTE: if the current highlighed
  index is within the top 5 indices, the bottom-most index will be highlighted.)

- `Home`: if menu is closed, it will not add any other behavior. If menu is open,
  the top-most index will get highlighted.

- `End`: if menu is closed, it will not add any other behavior. If menu is open,
  the bottom-most index will get highlighted.

- `Enter`: if the menu is open, selects the currently highlighted item. If the menu
  is open, the usual 'Enter' event is prevented by Downshift's default implicit enter
  handler; so, for example, a form submission event will not work as one might expect
  (though if the menu is closed the form submission will work normally). See below
  for customizing the handlers.

- `Escape`: will reset downshift's state. This means that `highlightedIndex` will be
  set to the `defaultHighlightedIndex`, the `inputValue` will be set to the `itemToString`
  value of the `selectedItem`, and the `isOpen` state will be set to the `defaultIsOpen`.

### customizing handlers

You can provide your own event handlers to Downshift which will be called before the default handlers:

```javascript
const ui = (
  <Downshift>
    {({getInputProps}) => (
      <input
        {...getInputProps({
          onKeyDown: event => {
            // your handler code
          },
        })}
      />
    )}
  </Downshift>
)
```

If you would like to prevent the default handler behavior in some cases, you can set the event's `preventDownshiftDefault` property to `true`:

```javascript
const ui = (
  <Downshift>
    {({getInputProps}) => (
      <input
        {...getInputProps({
          onKeyDown: event => {
            if (event.key === 'Enter') {
              // Prevent Downshift's default 'Enter' behavior.
              event.nativeEvent.preventDownshiftDefault = true

              // your handler code
            }
          },
        })}
      />
    )}
  </Downshift>
)
```

If you would like to completely override Downshift's behavior for a handler, in favor of your own, you can bypass prop getters:

```javascript
const ui = (
  <Downshift>
    {({getInputProps}) => (
      <input
        {...getInputProps()}
        onKeyDown={event => {
          // your handler code
        }}
      />
    )}
  </Downshift>
)
```

## Utilities

### resetIdCounter

Allows reseting the internal id counter which is used to generate unique ids for Downshift component.

You should never need to use this in the browser. Only if you are running an universal React app that is rendered on the server you should call [resetIdCounter](#resetidcounter) before every render so that the ids that get generated on the server match the ids generated in the browser.

```javascript
import {resetIdCounter} from 'downshift';

resetIdCounter()
ReactDOMServer.renderToString(...);
```

## React Native

Since Downshift renders it's UI using render props, Downshift supports rendering on React Native with ease. Use components like `<View>`, `<Text>`, `<TouchableOpacity>` and others inside of your render method to generate awesome autocomplete, dropdown, or selection components.

### Gotchas

- Your root view will need to either pass a ref to `getRootProps` or call `getRootProps` with `{ suppressRefError: true }`. This ref is used to catch a common set of errors around composite components. [Learn more in `getRootProps`](#getrootprops).
- When using a `<FlatList>` or `<ScrollView>`, be sure to supply the [`keyboardShouldPersistTaps`](https://facebook.github.io/react-native/docs/scrollview.html#keyboardshouldpersisttaps) prop to ensure that your text input stays focus, while allowing for taps on the touchables rendered for your items.

## Advanced React Component Patterns course

[Kent C. Dodds](https://twitter.com/kentcdodds) has created learning material
based on the patterns implemented in this component. You can find it on various
platforms:

1.  [egghead.io](https://egghead.io/courses/advanced-react-component-patterns)
2.  [Frontend Masters](https://frontendmasters.com/courses/advanced-react-patterns/)
3.  YouTube (for free!): [Part 1](https://www.youtube.com/watch?v=SuzutbwjUp8&list=PLV5CVI1eNcJgNqzNwcs4UKrlJdhfDjshf) and [Part 2](https://www.youtube.com/watch?v=ubXtOROjILU&list=PLV5CVI1eNcJgNqzNwcs4UKrlJdhfDjshf)

## Examples

> 🚨 We're in the process of moving all examples to the
> [downshift-examples](https://github.com/kentcdodds/downshift-examples) repo
> (which you can open, interact with, and contribute back to live on
> [codesandbox](https://codesandbox.io/s/github/kentcdodds/downshift-examples))

**Ordered Examples:**

If you're just learning downshift, review these in order:

1.  [basic autocomplete](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fordered-examples%2F01-basic-autocomplete.js&moduleview=1) - very bare bones, not styled at all. Good place to start.
2.  [styled autocomplete](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fordered-examples%2F02-complete-autocomplete.js&moduleview=1) - more complete autocomplete solution using emotion for styling and match-sorter for filtering the items.
3.  [typeahead](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fordered-examples%2F03-typeahead.js&moduleview=1) - Shows how to control the `selectedItem` so the selected item can be one of your items or whatever the user types.
4.  [multi-select](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fordered-examples%2F04-multi-select.js&moduleview=1) - Shows how to create a MultiDownshift component that allows for an array of selectedItems for multiple selection using a state reducer

**Other Examples:**

Check out these examples of more advanced use/edge cases:

- [dropdown with select by key](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fother-examples%2Fdropdown-select-by-key%2FCustomDropdown%2Findex.js) - An example of using the render prop pattern to utilize a reusable component to provide the downshift dropdown component with the functionality of being able to highlight a selection item that starts with the key pressed.
- [using actions](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fother-examples%2Fusing-actions.js&moduleview=1) - An example of using one of downshift's actions as an event handler.
- [gmail's composition recipients field](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fother-examples%2Fgmail%2Findex.js&moduleview=1) - An example of a highly complex autocomplete component featuring asynchronously loading items, multiple selection, and windowing (with react-virtualized)
- [Downshift HOC and Compound Components](https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fother-examples%2Fhoc%2Findex.js&moduleview=1) - An example of how to implementat compound components with `React.createContext` and a downshift higher order component. This is generally not recommended because the render prop API exported by downshift is generally good enough for everyone, but there's nothing technically wrong with doing something like this.

**Old Examples exist on [codesandbox.io][examples]:**

_🚨 This is a great contribution opportunity!_ These are examples that have not yet been migrated to
[downshift-examples](https://codesandbox.io/s/github/kentcdodds/downshift-examples).
You're more than welcome to make PRs to the examples repository to move these examples over there.
[Watch this to learn how to contribute completely in the browser](https://www.youtube.com/watch?v=3PAQbhdkTtI&index=2&t=21s&list=PLV5CVI1eNcJgCrPH_e6d57KRUTiDZgs0u)

- [Integration with Apollo](https://codesandbox.io/s/m5zrvqj85p)
- [Integration with Redux](https://codesandbox.io/s/3ywmnyr0zq)
- [Integration with `react-instantsearch`](https://codesandbox.io/s/kvn0lpp83)
  from Algolia
- [Material-UI (1.0.0-beta.4) Combobox Using Downshift](https://codesandbox.io/s/QMGq4kAY)
- [Material-UI (1.0.0-beta.33) Multiple select with autocomplete](https://codesandbox.io/s/7k3674z09q)
- [Integration with `GenieJS`](https://codesandbox.io/s/jRLKrxwgl)
  ([learn more about `genie` here](https://github.com/kentcdodds/genie))
- [Handling and displaying errors](https://codesandbox.io/s/zKE37vorr)
- [Integration with React Router](https://codesandbox.io/s/ww9lwloy8w)
- [Windowing with `react-tiny-virtual-list`](https://codesandbox.io/s/v670kq95l)
- [Section/option group example](https://codesandbox.io/s/zx1kj58npl)
- [Integration with `fuzzaldrin-plus` (Fuzzy matching)](https://codesandbox.io/s/pyq3v4o3j)
- [Dropdown/select implementation with Bootstrap](https://codesandbox.io/s/53y8jvpj0k)
- [Multiple editable tag selection](https://codesandbox.io/s/o4yp9vmm8z)
- [Downshift implemented as compound components and a Higher Order Component](https://codesandbox.io/s/017n1jqo00)
  (exposes a `withDownshift` higher order component which you can use to get at
  the state, actions, prop getters in a rendered downshift tree).
- [Downshift Spectre.css example](https://codesandbox.io/s/M89KQOBRB)
- [Integration with `redux-form`](https://codesandbox.io/s/k594964z13)
- [Integration with `react-final-form`](https://codesandbox.io/s/qzm43nn2mj)
- [Provider Pattern](https://codesandbox.io/s/mywzk3133p) - how to avoid prop-drilling if you like to break up your render method into more components
- [React Native example](https://snack.expo.io/SkE0LxXqM)
- [React VR example](https://github.com/infiniteluke/bassdrop)
- [Multiple checkbox selection](https://codesandbox.io/s/5z711pmr3l)

## FAQ

<details>

<summary>How do I avoid the checksum error when server rendering (SSR)?</summary>

The checksum error you're seeing is most likely due to the automatically
generated `id` and/or `htmlFor` prop you get from `getInputProps` and
`getLabelProps` (respectively). It could also be from the automatically
generated `id` prop you get from `getItemProps` (though this is not likely as
you're probably not rendering any items when rendering a downshift component on
the server).

To avoid these problems, simply call [resetIdCounter](#resetidcounter) before
`ReactDOM.renderToString`.

Alternatively you could provide your own ids via the id props where you render
`<Downshift />`:

```javascript
const ui = (
  <Downshift
    id="autocomplete"
    labelId="autocomplete-label"
    inputId="autocomplete-input"
    menuId="autocomplete-menu"
  >
    {({getInputProps, getLabelProps}) => <div>{/* your UI */}</div>}
  </Downshift>
)
```

</details>

## Inspiration

I was heavily inspired by [Ryan Florence][ryan]. Watch his (free) lesson about
["Compound Components"][compound-components-lecture]. Initially downshift was a
group of compound components using context to communicate. But then [Jared
Forsyth][jared] suggested I expose functions (the prop getters) to get props to
apply to the elements rendered. That bit of inspiration made a big impact on the
flexibility and simplicity of this API.

I also took a few ideas from the code in
[`react-autocomplete`][react-autocomplete] and [jQuery UI's
Autocomplete][jquery-complete].

You can watch me build the first iteration of `downshift` on YouTube:

- [Part 1](https://www.youtube.com/watch?v=2kzD1IjDy5s&list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE&index=11)
- [Part 2](https://www.youtube.com/watch?v=w1Z7Jvj08_s&list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE&index=10)

You'll find more recordings of me working on `downshift` on [my livestream
YouTube playlist][yt-playlist].

## Other Solutions

You can implement these other solutions using `downshift`, but if you'd prefer
to use these out of the box solutions, then that's fine too:

- [`react-select`](https://github.com/JedWatson/react-select)
- [`react-autocomplete`](https://github.com/reactjs/react-autocomplete)

## Bindings for ReasonML

If you're developing some React in ReasonML, check out the [`Downshift` bindings](https://github.com/reasonml-community/bs-downshift) for that.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=kentcdodds "Code") [📖](https://github.com/downshift-js/downshift/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/downshift-js/downshift/commits?author=kentcdodds "Tests") [👀](#review-kentcdodds "Reviewed Pull Requests") [📝](#blog-kentcdodds "Blogposts") [🐛](https://github.com/downshift-js/downshift/issues?q=author%3Akentcdodds "Bug reports") [💡](#example-kentcdodds "Examples") [🤔](#ideas-kentcdodds "Ideas, Planning, & Feedback") [📢](#talk-kentcdodds "Talks") | [<img src="https://avatars0.githubusercontent.com/u/100200?v=4" width="100px;"/><br /><sub><b>Ryan Florence</b></sub>](http://twitter.com/ryanflorence)<br />[🤔](#ideas-ryanflorence "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/112170?v=4" width="100px;"/><br /><sub><b>Jared Forsyth</b></sub>](http://jaredforsyth.com)<br />[🤔](#ideas-jaredly "Ideas, Planning, & Feedback") [📖](https://github.com/downshift-js/downshift/commits?author=jaredly "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/8162598?v=4" width="100px;"/><br /><sub><b>Jack Moore</b></sub>](https://github.com/jtmthf)<br />[💡](#example-jtmthf "Examples") | [<img src="https://avatars1.githubusercontent.com/u/2762082?v=4" width="100px;"/><br /><sub><b>Travis Arnold</b></sub>](http://travisrayarnold.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=souporserious "Code") [📖](https://github.com/downshift-js/downshift/commits?author=souporserious "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1045233?v=4" width="100px;"/><br /><sub><b>Marcy Sutton</b></sub>](http://marcysutton.com)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Amarcysutton "Bug reports") [🤔](#ideas-marcysutton "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/244704?v=4" width="100px;"/><br /><sub><b>Jeremy Gayed</b></sub>](http://www.jeremygayed.com)<br />[💡](#example-tizmagik "Examples") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/6270048?v=4" width="100px;"/><br /><sub><b>Haroen Viaene</b></sub>](https://haroen.me)<br />[💡](#example-Haroenv "Examples") | [<img src="https://avatars2.githubusercontent.com/u/15073300?v=4" width="100px;"/><br /><sub><b>monssef</b></sub>](https://github.com/rezof)<br />[💡](#example-rezof "Examples") | [<img src="https://avatars2.githubusercontent.com/u/5382443?v=4" width="100px;"/><br /><sub><b>Federico Zivolo</b></sub>](https://fezvrasta.github.io)<br />[📖](https://github.com/downshift-js/downshift/commits?author=FezVrasta "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/746482?v=4" width="100px;"/><br /><sub><b>Divyendu Singh</b></sub>](https://divyendusingh.com)<br />[💡](#example-divyenduz "Examples") [💻](https://github.com/downshift-js/downshift/commits?author=divyenduz "Code") [📖](https://github.com/downshift-js/downshift/commits?author=divyenduz "Documentation") [⚠️](https://github.com/downshift-js/downshift/commits?author=divyenduz "Tests") | [<img src="https://avatars1.githubusercontent.com/u/841955?v=4" width="100px;"/><br /><sub><b>Muhammad Salman</b></sub>](https://github.com/salmanmanekia)<br />[💻](https://github.com/downshift-js/downshift/commits?author=salmanmanekia "Code") | [<img src="https://avatars3.githubusercontent.com/u/10820159?v=4" width="100px;"/><br /><sub><b>João Alberto</b></sub>](https://twitter.com/psicotropidev)<br />[💻](https://github.com/downshift-js/downshift/commits?author=psicotropicos "Code") | [<img src="https://avatars0.githubusercontent.com/u/16327281?v=4" width="100px;"/><br /><sub><b>Bernard Lin</b></sub>](https://github.com/bernard-lin)<br />[💻](https://github.com/downshift-js/downshift/commits?author=bernard-lin "Code") [📖](https://github.com/downshift-js/downshift/commits?author=bernard-lin "Documentation") |
| [<img src="https://avatars1.githubusercontent.com/u/7330124?v=4" width="100px;"/><br /><sub><b>Geoff Davis</b></sub>](https://geoffdavis.info)<br />[💡](#example-geoffdavis92 "Examples") | [<img src="https://avatars0.githubusercontent.com/u/3415488?v=4" width="100px;"/><br /><sub><b>Anup</b></sub>](https://github.com/reznord)<br />[📖](https://github.com/downshift-js/downshift/commits?author=reznord "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/340520?v=4" width="100px;"/><br /><sub><b>Ferdinand Salis</b></sub>](http://ferdinandsalis.com)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Aferdinandsalis "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=ferdinandsalis "Code") | [<img src="https://avatars2.githubusercontent.com/u/662750?v=4" width="100px;"/><br /><sub><b>Kye Hohenberger</b></sub>](https://github.com/tkh44)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Atkh44 "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/1443499?v=4" width="100px;"/><br /><sub><b>Julien Goux</b></sub>](https://github.com/jgoux)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Ajgoux "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=jgoux "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=jgoux "Tests") | [<img src="https://avatars2.githubusercontent.com/u/9586897?v=4" width="100px;"/><br /><sub><b>Joachim Seminck</b></sub>](https://github.com/jseminck)<br />[💻](https://github.com/downshift-js/downshift/commits?author=jseminck "Code") | [<img src="https://avatars3.githubusercontent.com/u/954596?v=4" width="100px;"/><br /><sub><b>Jesse Harlin</b></sub>](http://jesseharlin.net/)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Athe-simian "Bug reports") [💡](#example-the-simian "Examples") |
| [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;"/><br /><sub><b>Matt Parrish</b></sub>](https://github.com/pbomb)<br />[🔧](#tool-pbomb "Tools") [👀](#review-pbomb "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/11661846?v=4" width="100px;"/><br /><sub><b>thom</b></sub>](http://thom.kr)<br />[💻](https://github.com/downshift-js/downshift/commits?author=thomhos "Code") | [<img src="https://avatars2.githubusercontent.com/u/1088312?v=4" width="100px;"/><br /><sub><b>Vu Tran</b></sub>](http://twitter.com/tranvu)<br />[💻](https://github.com/downshift-js/downshift/commits?author=vutran "Code") | [<img src="https://avatars1.githubusercontent.com/u/74193?v=4" width="100px;"/><br /><sub><b>Codie Mullins</b></sub>](https://github.com/codiemullins)<br />[💻](https://github.com/downshift-js/downshift/commits?author=codiemullins "Code") [💡](#example-codiemullins "Examples") | [<img src="https://avatars3.githubusercontent.com/u/12202757?v=4" width="100px;"/><br /><sub><b>Mohammad Rajabifard</b></sub>](https://morajabi.me)<br />[📖](https://github.com/downshift-js/downshift/commits?author=morajabi "Documentation") [🤔](#ideas-morajabi "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/9488719?v=4" width="100px;"/><br /><sub><b>Frank Tan</b></sub>](https://github.com/tansongyang)<br />[💻](https://github.com/downshift-js/downshift/commits?author=tansongyang "Code") | [<img src="https://avatars3.githubusercontent.com/u/5093058?v=4" width="100px;"/><br /><sub><b>Kier Borromeo</b></sub>](https://kierb.com)<br />[💡](#example-srph "Examples") |
| [<img src="https://avatars1.githubusercontent.com/u/8969456?v=4" width="100px;"/><br /><sub><b>Paul Veevers</b></sub>](https://github.com/paul-veevers)<br />[💻](https://github.com/downshift-js/downshift/commits?author=paul-veevers "Code") | [<img src="https://avatars2.githubusercontent.com/u/13622298?v=4" width="100px;"/><br /><sub><b>Ron Cruz</b></sub>](https://github.com/Ronolibert)<br />[📖](https://github.com/downshift-js/downshift/commits?author=Ronolibert "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/13605633?v=4" width="100px;"/><br /><sub><b>Rick McGavin</b></sub>](http://rickmcgavin.github.io)<br />[📖](https://github.com/downshift-js/downshift/commits?author=rickMcGavin "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/869669?v=4" width="100px;"/><br /><sub><b>Jelle Versele</b></sub>](http://twitter.com/vejersele)<br />[💡](#example-vejersele "Examples") | [<img src="https://avatars1.githubusercontent.com/u/202773?v=4" width="100px;"/><br /><sub><b>Brent Ertz</b></sub>](https://github.com/brentertz)<br />[🤔](#ideas-brentertz "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/8015514?v=4" width="100px;"/><br /><sub><b>Justice Mba </b></sub>](https://github.com/Dajust)<br />[💻](https://github.com/downshift-js/downshift/commits?author=Dajust "Code") [📖](https://github.com/downshift-js/downshift/commits?author=Dajust "Documentation") [🤔](#ideas-Dajust "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/3925281?v=4" width="100px;"/><br /><sub><b>Mark Ellis</b></sub>](http://mfellis.com)<br />[🤔](#ideas-ellismarkf "Ideas, Planning, & Feedback") |
| [<img src="https://avatars1.githubusercontent.com/u/3241922?v=4" width="100px;"/><br /><sub><b>us͡an̸df͘rien͜ds͠</b></sub>](http://ronak.io/)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Ausandfriends "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=usandfriends "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=usandfriends "Tests") | [<img src="https://avatars0.githubusercontent.com/u/474248?v=4" width="100px;"/><br /><sub><b>Robin Drexler</b></sub>](https://www.robin-drexler.com/)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Arobin-drexler "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=robin-drexler "Code") | [<img src="https://avatars0.githubusercontent.com/u/7406639?v=4" width="100px;"/><br /><sub><b>Arturo Romero</b></sub>](http://arturoromero.info/)<br />[💡](#example-arturoromeroslc "Examples") | [<img src="https://avatars1.githubusercontent.com/u/275483?v=4" width="100px;"/><br /><sub><b>yp</b></sub>](http://algolab.eu/pirola)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Ayp "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=yp "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=yp "Tests") | [<img src="https://avatars0.githubusercontent.com/u/3998604?v=4" width="100px;"/><br /><sub><b>Dave Garwacke</b></sub>](http://www.warbyparker.com)<br />[📖](https://github.com/downshift-js/downshift/commits?author=ifyoumakeit "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/11758660?v=4" width="100px;"/><br /><sub><b>Ivan Pazhitnykh</b></sub>](http://linkedin.com/in/drapegnik)<br />[💻](https://github.com/downshift-js/downshift/commits?author=Drapegnik "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=Drapegnik "Tests") | [<img src="https://avatars0.githubusercontent.com/u/61776?v=4" width="100px;"/><br /><sub><b>Luis Merino</b></sub>](https://github.com/Rendez)<br />[📖](https://github.com/downshift-js/downshift/commits?author=Rendez "Documentation") |
| [<img src="https://avatars0.githubusercontent.com/u/8746094?v=4" width="100px;"/><br /><sub><b>Andrew Hansen</b></sub>](http://twitter.com/arahansen)<br />[💻](https://github.com/downshift-js/downshift/commits?author=arahansen "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=arahansen "Tests") [🤔](#ideas-arahansen "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/20307225?v=4" width="100px;"/><br /><sub><b>John Whiles</b></sub>](http://www.johnwhiles.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=Jwhiles "Code") | [<img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;"/><br /><sub><b>Justin Hall</b></sub>](https://github.com/wKovacs64)<br />[🚇](#infra-wKovacs64 "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars2.githubusercontent.com/u/7641760?v=4" width="100px;"/><br /><sub><b>Pete Nykänen</b></sub>](https://twitter.com/pete_tnt)<br />[👀](#review-petetnt "Reviewed Pull Requests") | [<img src="https://avatars2.githubusercontent.com/u/4060187?v=4" width="100px;"/><br /><sub><b>Jared Palmer</b></sub>](http://jaredpalmer.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=jaredpalmer "Code") | [<img src="https://avatars3.githubusercontent.com/u/11477718?v=4" width="100px;"/><br /><sub><b>Philip Young</b></sub>](http://www.philipyoungg.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=philipyoungg "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=philipyoungg "Tests") [🤔](#ideas-philipyoungg "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/8997319?v=4" width="100px;"/><br /><sub><b>Alexander Nanberg</b></sub>](https://alexandernanberg.com)<br />[📖](https://github.com/downshift-js/downshift/commits?author=alexandernanberg "Documentation") [💻](https://github.com/downshift-js/downshift/commits?author=alexandernanberg "Code") |
| [<img src="https://avatars2.githubusercontent.com/u/1556430?v=4" width="100px;"/><br /><sub><b>Pete Redmond</b></sub>](https://httpete.com)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Ahttpete-ire "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/1706342?v=4" width="100px;"/><br /><sub><b>Nick Lavin</b></sub>](https://github.com/Zashy)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3AZashy "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=Zashy "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=Zashy "Tests") | [<img src="https://avatars2.githubusercontent.com/u/17031?v=4" width="100px;"/><br /><sub><b>James Long</b></sub>](http://jlongster.com)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Ajlongster "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=jlongster "Code") | [<img src="https://avatars0.githubusercontent.com/u/1505907?v=4" width="100px;"/><br /><sub><b>Michael Ball</b></sub>](http://michaelball.co)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Acycomachead "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=cycomachead "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=cycomachead "Tests") | [<img src="https://avatars0.githubusercontent.com/u/8990614?v=4" width="100px;"/><br /><sub><b>CAVALEIRO Julien</b></sub>](https://github.com/Julienng)<br />[💡](#example-Julienng "Examples") | [<img src="https://avatars1.githubusercontent.com/u/3421067?v=4" width="100px;"/><br /><sub><b>Kim Grönqvist</b></sub>](http://www.kimgronqvist.se)<br />[💻](https://github.com/downshift-js/downshift/commits?author=kimgronqvist "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=kimgronqvist "Tests") | [<img src="https://avatars2.githubusercontent.com/u/3675602?v=4" width="100px;"/><br /><sub><b>Sijie</b></sub>](http://sijietian.com)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Atiansijie "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=tiansijie "Code") |
| [<img src="https://avatars0.githubusercontent.com/u/410792?v=4" width="100px;"/><br /><sub><b>Dony Sukardi</b></sub>](http://dsds.io)<br />[💡](#example-donysukardi "Examples") [💬](#question-donysukardi "Answering Questions") [💻](https://github.com/downshift-js/downshift/commits?author=donysukardi "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=donysukardi "Tests") | [<img src="https://avatars1.githubusercontent.com/u/2755722?v=4" width="100px;"/><br /><sub><b>Dillon Mulroy</b></sub>](https://dillonmulroy.com)<br />[📖](https://github.com/downshift-js/downshift/commits?author=dmmulroy "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/12440573?v=4" width="100px;"/><br /><sub><b>Curtis Tate Wilkinson</b></sub>](https://twitter.com/curtytate)<br />[💻](https://github.com/downshift-js/downshift/commits?author=curtiswilkinson "Code") | [<img src="https://avatars3.githubusercontent.com/u/383212?v=4" width="100px;"/><br /><sub><b>Brice BERNARD</b></sub>](https://github.com/brikou)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Abrikou "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=brikou "Code") | [<img src="https://avatars3.githubusercontent.com/u/14304503?v=4" width="100px;"/><br /><sub><b>Tony Xu</b></sub>](https://github.com/xutopia)<br />[💻](https://github.com/downshift-js/downshift/commits?author=xutopia "Code") | [<img src="https://avatars1.githubusercontent.com/u/14035529?v=4" width="100px;"/><br /><sub><b>Anthony Ng</b></sub>](http://anthonyng.me)<br />[📖](https://github.com/downshift-js/downshift/commits?author=newyork-anthonyng "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/11996139?v=4" width="100px;"/><br /><sub><b>S S</b></sub>](https://github.com/notruth)<br />[💬](#question-notruth "Answering Questions") [💻](https://github.com/downshift-js/downshift/commits?author=notruth "Code") [📖](https://github.com/downshift-js/downshift/commits?author=notruth "Documentation") [🤔](#ideas-notruth "Ideas, Planning, & Feedback") [⚠️](https://github.com/downshift-js/downshift/commits?author=notruth "Tests") |
| [<img src="https://avatars0.githubusercontent.com/u/29493001?v=4" width="100px;"/><br /><sub><b>Austin Tackaberry</b></sub>](http://austintackaberry.co)<br />[💬](#question-austintackaberry "Answering Questions") [💻](https://github.com/downshift-js/downshift/commits?author=austintackaberry "Code") [📖](https://github.com/downshift-js/downshift/commits?author=austintackaberry "Documentation") [🐛](https://github.com/downshift-js/downshift/issues?q=author%3Aaustintackaberry "Bug reports") [💡](#example-austintackaberry "Examples") [🤔](#ideas-austintackaberry "Ideas, Planning, & Feedback") [👀](#review-austintackaberry "Reviewed Pull Requests") [⚠️](https://github.com/downshift-js/downshift/commits?author=austintackaberry "Tests") | [<img src="https://avatars3.githubusercontent.com/u/4168055?v=4" width="100px;"/><br /><sub><b>Jean Duthon</b></sub>](https://github.com/jduthon)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Ajduthon "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=jduthon "Code") | [<img src="https://avatars3.githubusercontent.com/u/3889580?v=4" width="100px;"/><br /><sub><b>Anton Telesh</b></sub>](http://antontelesh.github.io)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3AAntontelesh "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=Antontelesh "Code") | [<img src="https://avatars3.githubusercontent.com/u/1060669?v=4" width="100px;"/><br /><sub><b>Eric Edem</b></sub>](https://github.com/ericedem)<br />[💻](https://github.com/downshift-js/downshift/commits?author=ericedem "Code") [📖](https://github.com/downshift-js/downshift/commits?author=ericedem "Documentation") [🤔](#ideas-ericedem "Ideas, Planning, & Feedback") [⚠️](https://github.com/downshift-js/downshift/commits?author=ericedem "Tests") | [<img src="https://avatars3.githubusercontent.com/u/3409645?v=4" width="100px;"/><br /><sub><b>Austin Wood</b></sub>](https://github.com/indiesquidge)<br />[💬](#question-indiesquidge "Answering Questions") [📖](https://github.com/downshift-js/downshift/commits?author=indiesquidge "Documentation") [👀](#review-indiesquidge "Reviewed Pull Requests") | [<img src="https://avatars3.githubusercontent.com/u/14275790?v=4" width="100px;"/><br /><sub><b>Mark Murray</b></sub>](https://github.com/mmmurray)<br />[🚇](#infra-mmmurray "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars0.githubusercontent.com/u/1862172?v=4" width="100px;"/><br /><sub><b>Gianmarco</b></sub>](https://github.com/gsimone)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Agsimone "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=gsimone "Code") |
| [<img src="https://avatars2.githubusercontent.com/u/6838136?v=4" width="100px;"/><br /><sub><b>Emmanuel Pastor</b></sub>](https://github.com/pastr)<br />[💡](#example-pastr "Examples") | [<img src="https://avatars2.githubusercontent.com/u/10345034?v=4" width="100px;"/><br /><sub><b>dalehurwitz</b></sub>](https://github.com/dalehurwitz)<br />[💻](https://github.com/downshift-js/downshift/commits?author=dalehurwitz "Code") | [<img src="https://avatars1.githubusercontent.com/u/4813007?v=4" width="100px;"/><br /><sub><b>Bogdan Lobor</b></sub>](https://github.com/blobor)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Ablobor "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=blobor "Code") | [<img src="https://avatars0.githubusercontent.com/u/1127238?v=4" width="100px;"/><br /><sub><b>Luke Herrington</b></sub>](https://github.com/infiniteluke)<br />[💡](#example-infiniteluke "Examples") | [<img src="https://avatars2.githubusercontent.com/u/6361167?v=4" width="100px;"/><br /><sub><b>Brandon Clemons</b></sub>](https://github.com/drobannx)<br />[💻](https://github.com/downshift-js/downshift/commits?author=drobannx "Code") | [<img src="https://avatars0.githubusercontent.com/u/10591587?v=4" width="100px;"/><br /><sub><b>Kieran</b></sub>](https://github.com/aMollusk)<br />[💻](https://github.com/downshift-js/downshift/commits?author=aMollusk "Code") | [<img src="https://avatars3.githubusercontent.com/u/11570627?v=4" width="100px;"/><br /><sub><b>Brushedoctopus</b></sub>](https://github.com/Brushedoctopus)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3ABrushedoctopus "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=Brushedoctopus "Code") |
| [<img src="https://avatars3.githubusercontent.com/u/5456216?v=4" width="100px;"/><br /><sub><b>Cameron Edwards</b></sub>](http://cameronpedwards.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=cameronprattedwards "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=cameronprattedwards "Tests") | [<img src="https://avatars2.githubusercontent.com/u/179534?v=4" width="100px;"/><br /><sub><b>stereobooster</b></sub>](https://github.com/stereobooster)<br />[💻](https://github.com/downshift-js/downshift/commits?author=stereobooster "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=stereobooster "Tests") | [<img src="https://avatars0.githubusercontent.com/u/934879?v=4" width="100px;"/><br /><sub><b>Trevor Pierce</b></sub>](https://github.com/1Copenut)<br />[👀](#review-1Copenut "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/1334982?v=4" width="100px;"/><br /><sub><b>Xuefei Li</b></sub>](http://xuefei-frank.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=franklixuefei "Code") | [<img src="https://avatars0.githubusercontent.com/u/7252803?v=4" width="100px;"/><br /><sub><b>Alfred Ringstad</b></sub>](https://hyperlab.se)<br />[💻](https://github.com/downshift-js/downshift/commits?author=alfredringstad "Code") | [<img src="https://avatars0.githubusercontent.com/u/6895497?v=4" width="100px;"/><br /><sub><b>D[oa]vid Weisz</b></sub>](https://github.com/dovidweisz)<br />[💻](https://github.com/downshift-js/downshift/commits?author=dovidweisz "Code") | [<img src="https://avatars0.githubusercontent.com/u/19773?v=4" width="100px;"/><br /><sub><b>Royston Shufflebotham</b></sub>](https://github.com/RoystonS)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3ARoystonS "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=RoystonS "Code") |
| [<img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;"/><br /><sub><b>Michaël De Boey</b></sub>](http://michaeldeboey.be)<br />[💻](https://github.com/downshift-js/downshift/commits?author=MichaelDeBoey "Code") | [<img src="https://avatars3.githubusercontent.com/u/4412771?v=4" width="100px;"/><br /><sub><b>Henry</b></sub>](https://github.com/EricHenry)<br />[💻](https://github.com/downshift-js/downshift/commits?author=EricHenry "Code") | [<img src="https://avatars3.githubusercontent.com/u/2180127?v=4" width="100px;"/><br /><sub><b>Andrew Walton</b></sub>](http://www.greenarrow.me)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Agreen-arrow "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=green-arrow "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=green-arrow "Tests") | [<img src="https://avatars0.githubusercontent.com/u/13774309?v=4" width="100px;"/><br /><sub><b>Arthur Denner</b></sub>](https://github.com/arthurdenner)<br />[💻](https://github.com/downshift-js/downshift/commits?author=arthurdenner "Code") | [<img src="https://avatars2.githubusercontent.com/u/81981?v=4" width="100px;"/><br /><sub><b>Cody Olsen</b></sub>](http://twitter.com/stipsan)<br />[💻](https://github.com/downshift-js/downshift/commits?author=stipsan "Code") | [<img src="https://avatars0.githubusercontent.com/u/5084492?v=4" width="100px;"/><br /><sub><b>Thomas Ladd</b></sub>](https://github.com/TLadd)<br />[💻](https://github.com/downshift-js/downshift/commits?author=TLadd "Code") | [<img src="https://avatars3.githubusercontent.com/u/34634369?v=4" width="100px;"/><br /><sub><b>lixualinta</b></sub>](https://github.com/lixualinta)<br />[💻](https://github.com/downshift-js/downshift/commits?author=lixualinta "Code") |
| [<img src="https://avatars2.githubusercontent.com/u/2118956?v=4" width="100px;"/><br /><sub><b>Jacob Cofman</b></sub>](https://twitter.com/JCofman)<br />[💻](https://github.com/downshift-js/downshift/commits?author=JCofman "Code") | [<img src="https://avatars3.githubusercontent.com/u/19275184?v=4" width="100px;"/><br /><sub><b>Joshua Freedman</b></sub>](https://github.com/jf248)<br />[💻](https://github.com/downshift-js/downshift/commits?author=jf248 "Code") | [<img src="https://avatars1.githubusercontent.com/u/24494020?v=4" width="100px;"/><br /><sub><b>Amy</b></sub>](https://github.com/AmyScript)<br />[💡](#example-AmyScript "Examples") | [<img src="https://avatars1.githubusercontent.com/u/9063669?v=4" width="100px;"/><br /><sub><b>Rogin Farrer</b></sub>](http://twitter.com/roginfarrer)<br />[💻](https://github.com/downshift-js/downshift/commits?author=roginfarrer "Code") | [<img src="https://avatars3.githubusercontent.com/u/871583" width="100px;"/><br /><sub><b>Dmitrii Kanatnikov</b></sub>](https://github.com/rifler)<br />[💻](https://github.com/downshift-js/downshift/commits?author=rifler "Code") | [<img src="https://avatars2.githubusercontent.com/u/346300?v=4" width="100px;"/><br /><sub><b>Dallon Feldner</b></sub>](https://github.com/dallonf)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Adallonf "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=dallonf "Code") | [<img src="https://avatars2.githubusercontent.com/u/10165959?v=4" width="100px;"/><br /><sub><b>Samuel Fuller Thomas</b></sub>](https://samuelfullerthomas.com)<br />[💻](https://github.com/downshift-js/downshift/commits?author=samuelfullerthomas "Code") |
| [<img src="https://avatars1.githubusercontent.com/u/2430381?v=4" width="100px;"/><br /><sub><b>Ryan Castner</b></sub>](http://audiolion.github.io)<br />[💻](https://github.com/downshift-js/downshift/commits?author=audiolion "Code") | [<img src="https://avatars2.githubusercontent.com/u/11275392?v=4" width="100px;"/><br /><sub><b>Silviu Alexandru Avram</b></sub>](https://github.com/silviuavram)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Asilviuavram "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=silviuavram "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=silviuavram "Tests") | [<img src="https://avatars1.githubusercontent.com/u/15676655?v=4" width="100px;"/><br /><sub><b>Anton Volkov</b></sub>](https://github.com/akronb)<br />[💻](https://github.com/downshift-js/downshift/commits?author=akronb "Code") [⚠️](https://github.com/downshift-js/downshift/commits?author=akronb "Tests") | [<img src="https://avatars3.githubusercontent.com/u/513363?v=4" width="100px;"/><br /><sub><b>Keegan Street</b></sub>](http://keegan.st)<br />[🐛](https://github.com/downshift-js/downshift/issues?q=author%3Akeeganstreet "Bug reports") [💻](https://github.com/downshift-js/downshift/commits?author=keeganstreet "Code") | [<img src="https://avatars1.githubusercontent.com/u/894149?v=4" width="100px;"/><br /><sub><b>Manuel Dugué</b></sub>](http://manueldugue.de)<br />[💻](https://github.com/downshift-js/downshift/commits?author=mdugue "Code") | [<img src="https://avatars2.githubusercontent.com/u/12477983?v=4" width="100px;"/><br /><sub><b>Max Karadeniz</b></sub>](https://github.com/mkaradeniz)<br />[💻](https://github.com/downshift-js/downshift/commits?author=mkaradeniz "Code") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/downshift-js/downshift.svg?style=flat-square
[build]: https://travis-ci.org/downshift-js/downshift
[coverage-badge]: https://img.shields.io/codecov/c/github/downshift-js/downshift.svg?style=flat-square
[coverage]: https://codecov.io/github/downshift-js/downshift
[version-badge]: https://img.shields.io/npm/v/downshift.svg?style=flat-square
[package]: https://www.npmjs.com/package/downshift
[downloads-badge]: https://img.shields.io/npm/dm/downshift.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/downshift
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/downshift-js/downshift/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[chat]: https://gitter.im/downshift-js/downshift
[chat-badge]: https://img.shields.io/gitter/room/downshift-js/downshift.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/downshift-js/downshift/blob/master/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/downshift/dist/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square
[spectrum-badge]: https://withspectrum.github.io/badge/badge.svg
[spectrum]: https://spectrum.chat/downshift
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[ryan]: https://github.com/ryanflorence
[compound-components-lecture]: https://courses.reacttraining.com/courses/advanced-react/lectures/3060560
[react-autocomplete]: https://www.npmjs.com/package/react-autocomplete
[jquery-complete]: https://jqueryui.com/autocomplete/
[examples]: https://codesandbox.io/search?refinementList%5Btags%5D%5B0%5D=downshift%3Aexample&page=1
[yt-playlist]: https://www.youtube.com/playlist?list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE
[jared]: https://github.com/jaredly
[controlled-components-lecture]: https://courses.reacttraining.com/courses/advanced-react/lectures/3172720
[react-training]: https://reacttraining.com/
[advanced-react]: https://courses.reacttraining.com/courses/enrolled/200086
[use-a-render-prop]: https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce
[semver]: http://semver.org/
