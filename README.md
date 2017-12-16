<h1 align="center">
  downshift 🏎
  <br>
  <img src="https://cdn.rawgit.com/paypal/downshift/d9e94139/other/logo/downshift.svg" alt="downshift logo" title="downshift logo" width="300">
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">Primitives to build simple, flexible, WAI-ARIA compliant React
autocomplete/dropdown/select/combobox components</p>

> See
> [the intro blog post](https://blog.kentcdodds.com/introducing-downshift-for-react-b1de3fca0817)

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![downloads][downloads-badge]][npmcharts] [![version][version-badge]][package]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-52-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Chat][chat-badge]][chat]
[![Code of Conduct][coc-badge]][coc]

[![Supports React and Preact][react-badge]][react]
[![size][size-badge]][unpkg-dist] [![gzip size][gzip-badge]][unpkg-dist]
[![module formats: umd, cjs, and es][module-formats-badge]][unpkg-dist]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

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

* [Installation](#installation)
* [Usage](#usage)
* [Props](#props)
  * [defaultSelectedItem](#defaultselecteditem)
  * [defaultHighlightedIndex](#defaulthighlightedindex)
  * [defaultInputValue](#defaultinputvalue)
  * [defaultIsOpen](#defaultisopen)
  * [itemToString](#itemtostring)
  * [selectedItemChanged](#selecteditemchanged)
  * [getA11yStatusMessage](#geta11ystatusmessage)
  * [onChange](#onchange)
  * [onSelect](#onselect)
  * [onStateChange](#onstatechange)
  * [onInputValueChange](#oninputvaluechange)
  * [itemCount](#itemcount)
  * [highlightedIndex](#highlightedindex)
  * [inputValue](#inputvalue)
  * [isOpen](#isopen)
  * [selectedItem](#selecteditem)
  * [render](#render)
  * [id](#id)
  * [environment](#environment)
  * [onOuterClick](#onouterclick)
* [Control Props](#control-props)
* [Render Prop Function](#render-prop-function)
  * [prop getters](#prop-getters)
  * [actions](#actions)
  * [state](#state)
  * [props](#props)
* [Examples](#examples)
* [FAQ](#faq)
* [Upcoming Breaking Changes](#upcoming-breaking-changes)
* [Inspiration](#inspiration)
* [Other Solutions](#other-solutions)
* [Contributors](#contributors)
* [LICENSE](#license)

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

```jsx
import Downshift from 'downshift'

function BasicAutocomplete({items, onChange}) {
  return (
    <Downshift
      onChange={onChange}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => (
        <div>
          <input {...getInputProps({placeholder: 'Favorite color ?'})} />
          {isOpen ? (
            <div style={{border: '1px solid #ccc'}}>
              {items
                .filter(
                  i =>
                    !inputValue ||
                    i.toLowerCase().includes(inputValue.toLowerCase()),
                )
                .map((item, index) => (
                  <div
                    {...getItemProps({item})}
                    key={item}
                    style={{
                      backgroundColor:
                        highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
    />
  )
}

function App() {
  return (
    <BasicAutocomplete
      items={['apple', 'orange', 'carrot']}
      onChange={selectedItem => console.log(selectedItem)}
    />
  )
}
```

`downshift` is the only component. It doesn't render anything itself, it just
calls the render function and renders that. ["Use a render
prop!"][use-a-render-prop]! `<Downshift render={/* your JSX here! */} />`.

## Props

### defaultSelectedItem

> `any` | defaults to `null`

Pass an item or an array of items that should be selected by default.

### defaultHighlightedIndex

> `number`/`null` | defaults to `null`

This is the initial index to highlight when the menu first opens.

### defaultInputValue

> `string` | defaults to `''`

This is the initial input value.

### defaultIsOpen

> `boolean` | defaults to `false`

This is the initial `isOpen` value.

### itemToString

> `function(item: any)` | defaults to: `i => (i == null ? '' : String(i))`

Used to determine the string value for the selected item (which is used to
compute the `inputValue`.

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

### onChange

> `function(selectedItem: any, stateAndHelpers: object)` | optional, no useful
> default

Called when the user selects an item and the selected item has changed. Called
with the item that was selected and the new state of `downshift`. (see
`onStateChange` for more info on `stateAndHelpers`).

* `selectedItem`: The item that was just selected
* `stateAndHelpers`: This is the same thing your `render` prop function is
  called with (see [Render Prop Function](#render-prop-function))

### onSelect

> `function(selectedItem: any, stateAndHelpers: object)` | optional, no useful
> default

Called when the user selects an item, regardless of the previous selected item.
Called with the item that was selected and the new state of `downshift`. (see
`onStateChange` for more info on `stateAndHelpers`).

* `selectedItem`: The item that was just selected
* `stateAndHelpers`: This is the same thing your `render` prop function is
  called with (see [Render Prop Function](#render-prop-function))

### onStateChange

> `function(changes: object, stateAndHelpers: object)` | optional, no useful
> default

This function is called anytime the internal state changes. This can be useful
if you're using downshift as a "controlled" component, where you manage some or
all of the state (e.g. isOpen, selectedItem, highlightedIndex, etc) and then
pass it as props, rather than letting downshift control all its state itself.
The parameters both take the shape of internal state (`{highlightedIndex: number, inputValue: string, isOpen: boolean, selectedItem: any}`) but differ
slightly.

* `changes`: These are the properties that actually have changed since the last
  state change.
* `stateAndHelpers`: This is the exact same thing your `render` prop function is
  called with (see [Render Prop Function](#render-prop-function))

> Tip: This function will be called any time _any_ state is changed. The best
> way to determine whether any particular state was changed, you can use
> `changes.hasOwnProperty('propName')`.

> Note: the `changes` object will also have a `type` property that corresponds
> to a `Downshift.stateChangeTypes` property. This is an experimental feature so
> it's not recommended to use it if you can avoid it. If you need it, please
> open an issue to discuss solidifying the API.

### onInputValueChange

> `function(inputValue: string, stateAndHelpers: object)` | optional, no useful
> default

Called whenever the input value changes. Useful to use instead or in combination
of `onStateChange` when `inputValue` is a controlled prop to
[avoid issues with cursor positions](https://github.com/paypal/downshift/issues/217).

* `inputValue`: The current value of the input
* `stateAndHelpers`: This is the same thing your `render` prop function is
  called with (see [Render Prop Function](#render-prop-function))

### itemCount

> `number` | optional, defaults the number of times you call getItemProps

This is useful if you're using some kind of virtual listing component for
"windowing" (like
[`react-virtualized`](https://github.com/bvaughn/react-virtualized)).

### highlightedIndex

> `number` | **control prop** (read more about this in the "Control Props"
> section below)

The index that should be highlighted

### inputValue

> `string` | **control prop** (read more about this in the "Control Props"
> section below)

The value the input should have

### isOpen

> `boolean` | **control prop** (read more about this in the "Control Props"
> section below)

Whether the menu should be considered open or closed. Some aspects of the
downshift component respond differently based on this value (for example, if
`isOpen` is true when the user hits "Enter" on the input field, then the item at
the `highlightedIndex` item is selected).

### selectedItem

> `any`/`Array(any)` | **control prop** (read more about this in the "Control
> Props" section below)

The currently selected item.

### render

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Render Prop Function](#render-prop-function)".

### id

> `string` | defaults to a generated ID

You should not normally need to set this prop. It's only useful if you're server
rendering items (which each have an `id` prop generated based on the `downshift`
`id`). For more information see the `FAQ` below.

### environment

> `window` | defaults to `window`

You should not normally need to set this prop. It's only useful if you're
rendering into a different `window` context from where your JavaScript is
running, for example an iframe.

### onOuterClick

> `function` | optional

A helper callback to help control internal state of downshift like `isOpen` as
mentioned in [this issue](https://github.com/paypal/downshift/issues/206). The
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

## Control Props

downshift manages its own state internally and calls your `onChange` and
`onStateChange` handlers with any relevant changes. The state that downshift
manages includes: `isOpen`, `selectedItem`, `inputValue`, and
`highlightedIndex`. Your render prop function (read more below) can be used to
manipulate this state from within the render function and can likely support
many of your use cases.

However, if more control is needed, you can pass any of these pieces of state as
a prop (as indicated above) and that state becomes controlled. As soon as
`this.props[statePropKey] !== undefined`, internally, `downshift` will determine
its state based on your prop's value rather than its own internal state. You
will be required to keep the state up to date (this is where `onStateChange`
comes in really handy), but you can also control the state from anywhere, be
that state from other components, `redux`, `react-router`, or anywhere else.

> Note: This is very similar to how normal controlled components work elsewhere
> in react (like `<input />`). If you want to learn more about this concept, you
> can learn about that from this the ["Controlled Components"
> lecture][controlled-components-lecture] and exercises from [React
> Training's][react-training] > [Advanced React][advanced-react] course.

## Render Prop Function

This is where you render whatever you want to based on the state of `downshift`.
It's a regular prop called `render`: `<Downshift render={/* right here*/} />`.

> You can also pass it as the children prop if you prefer to do things that way
> `<Downshift>{/* right here*/}</Downshift>`

The properties of this object can be split into three categories as indicated
below:

### prop getters

> See
> [the blog post about prop getters](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf)

These functions are used to apply props to the elements that you render. This
gives you maximum flexibility to render what, when, and wherever you like. You
call these on the element in question (for example: `<input {...getInputProps()}`)). It's advisable to pass all your props to that function
rather than applying them on the element yourself to avoid your props being
overridden (or overriding the props returned). For example:
`getInputProps({onKeyUp(event) {console.log(event)}})`.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property         | type              | description                                                                                 |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `getButtonProps` | `function({})`    | returns the props you should apply to any menu toggle button element you render.            |
| `getInputProps`  | `function({})`    | returns the props you should apply to the `input` element that you render.                  |
| `getItemProps`   | `function({})`    | returns the props you should apply to any menu item elements you render.                    |
| `getLabelProps`  | `function({})`    | returns the props you should apply to the `label` element that you render.                  |
| `getRootProps`   | `function({},{})` | returns the props you should apply to the root element that you render. It can be optional. |

#### `getRootProps`

Most of the time, you can just render a `div` yourself and `Downshift` will
apply the props it needs to do its job (and you don't need to call this
function). However, if you're rendering a composite component (custom component)
as the root element, then you'll need to call `getRootProps` and apply that to
your root element.

Required properties:

* `refKey`: if you're rendering a composite component, that component will need
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
See issue paypal/downshift#235 for the discussion that lead to this.

#### `getInputProps`

This method should be applied to the `input` you render. It is recommended that
you pass all props as an object to this method which will compose together any
of the event handlers you need to apply to the `input` while preserving the ones
that `downshift` needs to apply to make the `input` behave.

There are no required properties for this method.

#### `getLabelProps`

This method should be applied to the `label` you render. It is useful for
ensuring that the `for` attribute on the `<label>` (`htmlFor` as a react prop)
is the same as the `id` that appears on the `input`. If no `htmlFor` is provided
then an ID will be generated and used for the `input` and the `label` `for`
attribute.

There are no required properties for this method.

> Note: You can definitely get by without using this (just provide an `id` to
> your input and the same `htmlFor` to your `label` and you'll be good with
> accessibility). However, we include this so you don't forget and it makes
> things a little nicer for you. You're welcome 😀

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

* `item`: this is the item data that will be selected when the user selects a
  particular item.

Optional properties:

* `index`: this is how `downshift` keeps track of your item when updating the
  `highlightedIndex` as the user keys around. By default, `downshift` will
  assume the `index` is the order in which you're calling `getItemProps`. This
  is often good enough, but if you find odd behavior, try setting this
  explicitly. It's probably best to be explicit about `index` when using a
  windowing library like `react-virtualized`.

#### `getButtonProps`

Call this and apply the returned props to a `button`. It allows you to toggle
the `Menu` component. You can definitely build something like this yourself (all
of the available APIs are exposed to you), but this is nice because it will also
apply all of the proper ARIA attributes. The `aria-label` prop is in English.
You should probably override this yourself so you can provide translations:

```jsx
const myButton = (
  <button
    {...getButtonProps({
      'aria-label': translateWithId(isOpen ? 'close.menu' : 'open.menu'),
    })}
  />
)
```

### actions

These are functions you can call to change the state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property                | type                                                             | description                                                                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clearSelection`        | `function(cb: Function)`                                         | clears the selection                                                                                                                                                                |
| `clearItems`            | `function()`                                                     | Clears downshift's record of all the items. Only really useful if you render your items asynchronously within downshift. See [#186](https://github.com/paypal/downshift/issues/186) |
| `closeMenu`             | `function(cb: Function)`                                         | closes the menu                                                                                                                                                                     |
| `openMenu`              | `function(cb: Function)`                                         | opens the menu                                                                                                                                                                      |
| `selectHighlightedItem` | `function(otherStateToSet: object, cb: Function)`                | selects the item that is currently highlighted                                                                                                                                      |
| `selectItem`            | `function(item: any, otherStateToSet: object, cb: Function)`     | selects the given item                                                                                                                                                              |
| `selectItemAtIndex`     | `function(index: number, otherStateToSet: object, cb: Function)` | selects the item at the given index                                                                                                                                                 |
| `setHighlightedIndex`   | `function(index: number, otherStateToSet: object, cb: Function)` | call to set a new highlighted index                                                                                                                                                 |
| `toggleMenu`            | `function(otherStateToSet: object, cb: Function)`                | toggle the menu open state                                                                                                                                                          |
| `reset`                 | `function(otherStateToSet: object, cb: Function)`                | this resets downshift's state to a reasonable default                                                                                                                               |
| `setItemCount`          | `function(count: number)`                                        | this sets the `itemCount`. Handy in situations where you're using windowing and the items are loaded asynchronously from within downshift (so you can't use the `itemCount` prop.   |
| `unsetItemCount`        | `function()`                                                     | this unsets the `itemCount` which means the item count will be calculated instead by the `itemCount` prop or based on how many times you call `getItemProps`.                       |

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

## Examples

Examples exist on [codesandbox.io][examples]:

* [Bare bones autocomplete](https://codesandbox.io/s/6z67jvklw3)
* [Multiple selection](https://codesandbox.io/s/W6gyJ30kn) (uses controlled
  `selectedItem` API).
* [Type Ahead Example](https://codesandbox.io/s/82m2px40q9) (uses controlled
  `selectedItem` API).
* [Integration with Apollo](https://codesandbox.io/s/m5zrvqj85p)
* [Integration with Redux](https://codesandbox.io/s/3ywmnyr0zq)
* [Integration with `react-instantsearch`](https://codesandbox.io/s/kvn0lpp83)
  from Algolia
* [Material UI (1.0.0-beta.4) Combobox Using Downshift](https://codesandbox.io/s/QMGq4kAY)
* [Integration with `GenieJS`](https://codesandbox.io/s/jRLKrxwgl)
  ([learn more about `genie` here](https://github.com/kentcdodds/genie))
* [Handling and displaying errors](https://codesandbox.io/s/zKE37vorr)
* [Integration with React Router](https://codesandbox.io/s/ww9lwloy8w)
* [Windowing with `react-tiny-virtual-list`](https://codesandbox.io/s/v670kq95l)
* [Section/option group example](https://codesandbox.io/s/zx1kj58npl)
* [Integration with `fuzzaldrin-plus` (Fuzzy matching)](https://codesandbox.io/s/pyq3v4o3j)
* [Dropdown/select implementation with Bootstrap](https://codesandbox.io/s/53y8jvpj0k)
* [Multiple editable tag selection](https://codesandbox.io/s/o4yp9vmm8z)
* [Downshift implemented as compound components and a Higher Order Component](https://codesandbox.io/s/017n1jqo00)
  (exposes a `withDownshift` higher order component which you can use to get at
  the state, actions, prop getters in a rendered downshift tree).
* [Downshift Spectre.css example](https://codesandbox.io/s/M89KQOBRB)

If you would like to add an example, follow these steps:

1. Fork [this codesandbox](http://kcd.im/ds-example)
2. Make sure your version (under dependencies) is the latest available version.
3. Update the title and description
4. Update the code for your example (add some form of documentation to explain
   what it is)
5. Add the tag: `downshift:example`

You'll find other examples in the `stories/examples` folder of the repo. And
you'll find
[a live version of those examples here](https://downshift.netlify.com)

## FAQ

<details>

<summary>How do I avoid the checksum error when server rendering (SSR)?</summary>

The checksum error you're seeing is most likely due to the automatically
generated `id` and/or `htmlFor` prop you get from `getInputProps` and
`getLabelProps` (respectively). It could also be from the automatically
generated `id` prop you get from `getItemProps` (though this is not likely as
you're probably not rendering any items when rendering a downshift component on
the server).

To avoid these problems, simply provide your own `id` prop in `getInputProps`
and `getLabelProps`. Also, you can use the `id` prop on the component
`Downshift`. For example:

```javascript
const ui = (
  <Downshift
    id="autocomplete"
    render={({getInputProps, getLabelProps}) => (
      <div>
        <label {...getLabelProps({htmlFor: 'autocomplete-input'})}>
          Some Label
        </label>
        <input {...getInputProps({id: 'autocomplete-input'})} />
      </div>
    )}
  />
)
```

</details>

## Upcoming Breaking Changes

We try to avoid breaking changes when possible and try to adhere to
[semver][semver]. Sometimes breaking changes are necessary and we'll make the
transition as smooth as possible. This is why there's a prop available which
will allow you to opt into breaking changes. It looks like this:

```javascript
const ui = (
  <Downshift
    breakingChanges={
      {
        /* breaking change flags here */
      }
    }
    render={() => <div />}
  />
)
```

To opt-into a breaking change, simply provide the key and value in the
`breakingChanges` object prop for each breaking change mentioned below:

1. `resetInputOnSelection` - Enable with the value of `true`. For more
   information, see [#243](https://github.com/paypal/downshift/issues/243)

When a new major version is released, then the code to support the old
functionality will be removed and the breaking change version will be the
default, so it's suggested you enable these as soon as you are aware of them.

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

* [Part 1](https://www.youtube.com/watch?v=2kzD1IjDy5s&list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE&index=11)
* [Part 2](https://www.youtube.com/watch?v=w1Z7Jvj08_s&list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE&index=10)

You'll find more recordings of me working on `downshift` on [my livestream
YouTube playlist][yt-playlist].

## Other Solutions

You can implement these other solutions using `downshift`, but if you'd prefer
to use these out of the box solutions, then that's fine too:

* [`react-select`](https://github.com/JedWatson/react-select)
* [`react-autocomplete`](https://github.com/reactjs/react-autocomplete)

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/paypal/downshift/commits?author=kentcdodds "Code") [📖](https://github.com/paypal/downshift/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/paypal/downshift/commits?author=kentcdodds "Tests") | [<img src="https://avatars0.githubusercontent.com/u/100200?v=4" width="100px;"/><br /><sub><b>Ryan Florence</b></sub>](http://twitter.com/ryanflorence)<br />[🤔](#ideas-ryanflorence "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/112170?v=4" width="100px;"/><br /><sub><b>Jared Forsyth</b></sub>](http://jaredforsyth.com)<br />[🤔](#ideas-jaredly "Ideas, Planning, & Feedback") [📖](https://github.com/paypal/downshift/commits?author=jaredly "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/8162598?v=4" width="100px;"/><br /><sub><b>Jack Moore</b></sub>](https://github.com/jtmthf)<br />[💡](#example-jtmthf "Examples") | [<img src="https://avatars1.githubusercontent.com/u/2762082?v=4" width="100px;"/><br /><sub><b>Travis Arnold</b></sub>](http://travisrayarnold.com)<br />[💻](https://github.com/paypal/downshift/commits?author=souporserious "Code") [📖](https://github.com/paypal/downshift/commits?author=souporserious "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1045233?v=4" width="100px;"/><br /><sub><b>Marcy Sutton</b></sub>](http://marcysutton.com)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Amarcysutton "Bug reports") [🤔](#ideas-marcysutton "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/244704?v=4" width="100px;"/><br /><sub><b>Jeremy Gayed</b></sub>](http://www.jeremygayed.com)<br />[💡](#example-tizmagik "Examples") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/6270048?v=4" width="100px;"/><br /><sub><b>Haroen Viaene</b></sub>](https://haroen.me)<br />[💡](#example-Haroenv "Examples") | [<img src="https://avatars2.githubusercontent.com/u/15073300?v=4" width="100px;"/><br /><sub><b>monssef</b></sub>](https://github.com/rezof)<br />[💡](#example-rezof "Examples") | [<img src="https://avatars2.githubusercontent.com/u/5382443?v=4" width="100px;"/><br /><sub><b>Federico Zivolo</b></sub>](https://fezvrasta.github.io)<br />[📖](https://github.com/paypal/downshift/commits?author=FezVrasta "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/746482?v=4" width="100px;"/><br /><sub><b>Divyendu Singh</b></sub>](https://divyendusingh.com)<br />[💡](#example-divyenduz "Examples") [💻](https://github.com/paypal/downshift/commits?author=divyenduz "Code") [📖](https://github.com/paypal/downshift/commits?author=divyenduz "Documentation") [⚠️](https://github.com/paypal/downshift/commits?author=divyenduz "Tests") | [<img src="https://avatars1.githubusercontent.com/u/841955?v=4" width="100px;"/><br /><sub><b>Muhammad Salman</b></sub>](https://github.com/salmanmanekia)<br />[💻](https://github.com/paypal/downshift/commits?author=salmanmanekia "Code") | [<img src="https://avatars3.githubusercontent.com/u/10820159?v=4" width="100px;"/><br /><sub><b>João Alberto</b></sub>](https://twitter.com/psicotropidev)<br />[💻](https://github.com/paypal/downshift/commits?author=psicotropicos "Code") | [<img src="https://avatars0.githubusercontent.com/u/16327281?v=4" width="100px;"/><br /><sub><b>Bernard Lin</b></sub>](https://github.com/bernard-lin)<br />[💻](https://github.com/paypal/downshift/commits?author=bernard-lin "Code") [📖](https://github.com/paypal/downshift/commits?author=bernard-lin "Documentation") |
| [<img src="https://avatars1.githubusercontent.com/u/7330124?v=4" width="100px;"/><br /><sub><b>Geoff Davis</b></sub>](https://geoffdavis.info)<br />[💡](#example-geoffdavis92 "Examples") | [<img src="https://avatars0.githubusercontent.com/u/3415488?v=4" width="100px;"/><br /><sub><b>Anup</b></sub>](https://github.com/reznord)<br />[📖](https://github.com/paypal/downshift/commits?author=reznord "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/340520?v=4" width="100px;"/><br /><sub><b>Ferdinand Salis</b></sub>](http://ferdinandsalis.com)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Aferdinandsalis "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=ferdinandsalis "Code") | [<img src="https://avatars2.githubusercontent.com/u/662750?v=4" width="100px;"/><br /><sub><b>Kye Hohenberger</b></sub>](https://github.com/tkh44)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Atkh44 "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/1443499?v=4" width="100px;"/><br /><sub><b>Julien Goux</b></sub>](https://github.com/jgoux)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Ajgoux "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=jgoux "Code") [⚠️](https://github.com/paypal/downshift/commits?author=jgoux "Tests") | [<img src="https://avatars2.githubusercontent.com/u/9586897?v=4" width="100px;"/><br /><sub><b>Joachim Seminck</b></sub>](https://github.com/jseminck)<br />[💻](https://github.com/paypal/downshift/commits?author=jseminck "Code") | [<img src="https://avatars3.githubusercontent.com/u/954596?v=4" width="100px;"/><br /><sub><b>Jesse Harlin</b></sub>](http://jesseharlin.net/)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Athe-simian "Bug reports") [💡](#example-the-simian "Examples") |
| [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;"/><br /><sub><b>Matt Parrish</b></sub>](https://github.com/pbomb)<br />[🔧](#tool-pbomb "Tools") [👀](#review-pbomb "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/11661846?v=4" width="100px;"/><br /><sub><b>thom</b></sub>](http://thom.kr)<br />[💻](https://github.com/paypal/downshift/commits?author=thomhos "Code") | [<img src="https://avatars2.githubusercontent.com/u/1088312?v=4" width="100px;"/><br /><sub><b>Vu Tran</b></sub>](http://twitter.com/tranvu)<br />[💻](https://github.com/paypal/downshift/commits?author=vutran "Code") | [<img src="https://avatars1.githubusercontent.com/u/74193?v=4" width="100px;"/><br /><sub><b>Codie Mullins</b></sub>](https://github.com/codiemullins)<br />[💻](https://github.com/paypal/downshift/commits?author=codiemullins "Code") [💡](#example-codiemullins "Examples") | [<img src="https://avatars3.githubusercontent.com/u/12202757?v=4" width="100px;"/><br /><sub><b>Mohammad Rajabifard</b></sub>](https://morajabi.me)<br />[📖](https://github.com/paypal/downshift/commits?author=morajabi "Documentation") [🤔](#ideas-morajabi "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/9488719?v=4" width="100px;"/><br /><sub><b>Frank Tan</b></sub>](https://github.com/tansongyang)<br />[💻](https://github.com/paypal/downshift/commits?author=tansongyang "Code") | [<img src="https://avatars3.githubusercontent.com/u/5093058?v=4" width="100px;"/><br /><sub><b>Kier Borromeo</b></sub>](https://kierb.com)<br />[💡](#example-srph "Examples") |
| [<img src="https://avatars1.githubusercontent.com/u/8969456?v=4" width="100px;"/><br /><sub><b>Paul Veevers</b></sub>](https://github.com/paul-veevers)<br />[💻](https://github.com/paypal/downshift/commits?author=paul-veevers "Code") | [<img src="https://avatars2.githubusercontent.com/u/13622298?v=4" width="100px;"/><br /><sub><b>Ron Cruz</b></sub>](https://github.com/Ronolibert)<br />[📖](https://github.com/paypal/downshift/commits?author=Ronolibert "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/13605633?v=4" width="100px;"/><br /><sub><b>Rick McGavin</b></sub>](http://rickmcgavin.github.io)<br />[📖](https://github.com/paypal/downshift/commits?author=rickMcGavin "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/869669?v=4" width="100px;"/><br /><sub><b>Jelle Versele</b></sub>](http://twitter.com/vejersele)<br />[💡](#example-vejersele "Examples") | [<img src="https://avatars1.githubusercontent.com/u/202773?v=4" width="100px;"/><br /><sub><b>Brent Ertz</b></sub>](https://github.com/brentertz)<br />[🤔](#ideas-brentertz "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/8015514?v=4" width="100px;"/><br /><sub><b>Justice Mba </b></sub>](https://github.com/Dajust)<br />[💻](https://github.com/paypal/downshift/commits?author=Dajust "Code") [📖](https://github.com/paypal/downshift/commits?author=Dajust "Documentation") [🤔](#ideas-Dajust "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/3925281?v=4" width="100px;"/><br /><sub><b>Mark Ellis</b></sub>](http://mfellis.com)<br />[🤔](#ideas-ellismarkf "Ideas, Planning, & Feedback") |
| [<img src="https://avatars1.githubusercontent.com/u/3241922?v=4" width="100px;"/><br /><sub><b>us͡an̸df͘rien͜ds͠</b></sub>](http://ronak.io/)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Ausandfriends "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=usandfriends "Code") [⚠️](https://github.com/paypal/downshift/commits?author=usandfriends "Tests") | [<img src="https://avatars0.githubusercontent.com/u/474248?v=4" width="100px;"/><br /><sub><b>Robin Drexler</b></sub>](https://www.robin-drexler.com/)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Arobin-drexler "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=robin-drexler "Code") | [<img src="https://avatars0.githubusercontent.com/u/7406639?v=4" width="100px;"/><br /><sub><b>Arturo Romero</b></sub>](http://arturoromero.info/)<br />[💡](#example-arturoromeroslc "Examples") | [<img src="https://avatars1.githubusercontent.com/u/275483?v=4" width="100px;"/><br /><sub><b>yp</b></sub>](http://algolab.eu/pirola)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Ayp "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=yp "Code") [⚠️](https://github.com/paypal/downshift/commits?author=yp "Tests") | [<img src="https://avatars0.githubusercontent.com/u/3998604?v=4" width="100px;"/><br /><sub><b>Dave Garwacke</b></sub>](http://www.warbyparker.com)<br />[📖](https://github.com/paypal/downshift/commits?author=ifyoumakeit "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/11758660?v=4" width="100px;"/><br /><sub><b>Ivan Pazhitnykh</b></sub>](http://linkedin.com/in/drapegnik)<br />[💻](https://github.com/paypal/downshift/commits?author=Drapegnik "Code") [⚠️](https://github.com/paypal/downshift/commits?author=Drapegnik "Tests") | [<img src="https://avatars0.githubusercontent.com/u/61776?v=4" width="100px;"/><br /><sub><b>Luis Merino</b></sub>](https://github.com/Rendez)<br />[📖](https://github.com/paypal/downshift/commits?author=Rendez "Documentation") |
| [<img src="https://avatars0.githubusercontent.com/u/8746094?v=4" width="100px;"/><br /><sub><b>Andrew Hansen</b></sub>](http://twitter.com/arahansen)<br />[💻](https://github.com/paypal/downshift/commits?author=arahansen "Code") [⚠️](https://github.com/paypal/downshift/commits?author=arahansen "Tests") [🤔](#ideas-arahansen "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/20307225?v=4" width="100px;"/><br /><sub><b>John Whiles</b></sub>](http://www.johnwhiles.com)<br />[💻](https://github.com/paypal/downshift/commits?author=Jwhiles "Code") | [<img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;"/><br /><sub><b>Justin Hall</b></sub>](https://github.com/wKovacs64)<br />[🚇](#infra-wKovacs64 "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars2.githubusercontent.com/u/7641760?v=4" width="100px;"/><br /><sub><b>Pete Nykänen</b></sub>](https://twitter.com/pete_tnt)<br />[👀](#review-petetnt "Reviewed Pull Requests") | [<img src="https://avatars2.githubusercontent.com/u/4060187?v=4" width="100px;"/><br /><sub><b>Jared Palmer</b></sub>](http://jaredpalmer.com)<br />[💻](https://github.com/paypal/downshift/commits?author=jaredpalmer "Code") | [<img src="https://avatars3.githubusercontent.com/u/11477718?v=4" width="100px;"/><br /><sub><b>Philip Young</b></sub>](http://www.philipyoungg.com)<br />[💻](https://github.com/paypal/downshift/commits?author=philipyoungg "Code") [⚠️](https://github.com/paypal/downshift/commits?author=philipyoungg "Tests") [🤔](#ideas-philipyoungg "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/8997319?v=4" width="100px;"/><br /><sub><b>Alexander Nanberg</b></sub>](https://alexandernanberg.com)<br />[📖](https://github.com/paypal/downshift/commits?author=alexandernanberg "Documentation") |
| [<img src="https://avatars2.githubusercontent.com/u/1556430?v=4" width="100px;"/><br /><sub><b>Pete Redmond</b></sub>](https://httpete.com)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Ahttpete-ire "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/1706342?v=4" width="100px;"/><br /><sub><b>Nick Lavin</b></sub>](https://github.com/Zashy)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3AZashy "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=Zashy "Code") [⚠️](https://github.com/paypal/downshift/commits?author=Zashy "Tests") | [<img src="https://avatars2.githubusercontent.com/u/17031?v=4" width="100px;"/><br /><sub><b>James Long</b></sub>](http://jlongster.com)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Ajlongster "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=jlongster "Code") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/paypal/downshift.svg?style=flat-square
[build]: https://travis-ci.org/paypal/downshift
[coverage-badge]: https://img.shields.io/codecov/c/github/paypal/downshift.svg?style=flat-square
[coverage]: https://codecov.io/github/paypal/downshift
[version-badge]: https://img.shields.io/npm/v/downshift.svg?style=flat-square
[package]: https://www.npmjs.com/package/downshift
[downloads-badge]: https://img.shields.io/npm/dm/downshift.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/downshift
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/paypal/downshift/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[chat]: https://gitter.im/paypal/downshift
[chat-badge]: https://img.shields.io/gitter/room/paypal/downshift.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/paypal/downshift/blob/master/other/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/downshift/dist/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square
[github-watch-badge]: https://img.shields.io/github/watchers/paypal/downshift.svg?style=social
[github-watch]: https://github.com/paypal/downshift/watchers
[github-star-badge]: https://img.shields.io/github/stars/paypal/downshift.svg?style=social
[github-star]: https://github.com/paypal/downshift/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20downshift!%20https://github.com/paypal/downshift%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/paypal/downshift.svg?style=social
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
