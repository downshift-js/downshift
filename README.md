<h1 align="center">
  downshift 🏎
  <br>
  <img src="https://cdn.rawgit.com/paypal/downshift/d9e94139/other/logo/downshift.svg" alt="downshift logo" title="downshift logo" width="300">
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">Primitives to build simple, flexible, WAI-ARIA compliant React
autocomplete/dropdown/select/combobox components</p>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![downloads][downloads-badge]][npmcharts]
[![version][version-badge]][package]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-27-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Chat][chat-badge]][chat]
[![Code of Conduct][coc-badge]][coc]

[![Supports React and Preact][react-badge]][react]
[![size][size-badge]][unpkg-dist]
[![gzip size][gzip-badge]][unpkg-dist]
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
create autocomplete/dropdown/select/etc. components. It uses a
[render function as children][fac] which gives you maximum flexibility with a
minimal API because you are responsible for the rendering of everything and you
simply apply props to what you're rendering.

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
- [Props](#props)
- [Control Props](#control-props)
- [Child Callback Function](#child-callback-function)
- [Examples](#examples)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
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
> `preact` then look in the `dist/` folder and use the module you want with the
> `preact` suffix.

## Usage

```jsx
import Downshift from 'downshift'

function BasicAutocomplete({items, onChange}) {
  return (
    <Downshift onChange={onChange}>
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex
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
    </Downshift>
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
calls the child function and renders that. Wrap everything in
`<Downshift>{/* your function here! */}</Downshift>`.

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

### getA11yStatusMessage

> `function({/* see below */})` | default messages provided in English

This function is passed as props to a `Status` component nested within and
allows you to create your own assertive ARIA statuses.

A default `getA11yStatusMessage` function is provided that will check
`resultCount` and return "No results." or if there are results but no item is
highlighted, "`resultCount` results are available, use up and down arrow keys
to navigate."  If an item is highlighted it will run
`itemToString(highlightedItem)` and display the value of the `highlightedItem`.

The object you are passed to generate your status message has the following
properties:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property              | type            | description                                                                                  |
|-----------------------|-----------------|----------------------------------------------------------------------------------------------|
| `highlightedIndex`    | `number`/`null` | The currently highlighted index                                                              |
| `highlightedValue`    | `any`           | The value of the highlighted item                                                            |
| `inputValue`          | `string`        | The current input value                                                                      |
| `isOpen`              | `boolean`       | The `isOpen` state                                                                           |
| `itemToString`        | `function(any)` | The `itemToString` function (see props) for getting the string value from one of the options |
| `previousResultCount` | `number`        | The total items showing in the dropdown the last time the status was updated                 |
| `resultCount`         | `number`        | The total items showing in the dropdown                                                      |
| `selectedItem`        | `any`           | The value of the currently selected item                                                     |

### onChange

> `function(selectedItem: any, stateAndHelpers: object)` | optional, no useful default

Called when the user selects an item. Called with the item that was selected
and the new state of `downshift`. (see `onStateChange` for more info on
`stateAndHelpers`).

- `selectedItem`: The item that was just selected
- `stateAndHelpers`: This is the exact same thing you're `children` prop
  function is called with (see [Child Callback Function](#child-callback-function))

### onStateChange

> `function(changes: object, stateAndHelpers: object)` | optional, no useful default

This function is called anytime the internal state changes. This can be useful
if you're using downshift as a "controlled" component, where you manage some or
all of the state (e.g. isOpen, selectedItem, highlightedIndex, etc) and then
pass it as props, rather than letting downshift control all its state itself.
The parameters both take the shape of internal state
(`{highlightedIndex: number, inputValue: string, isOpen: boolean, selectedItem: any}`)
but differ slightly.

- `changes`: These are the properties that actually have changed since the last
  state change.
- `stateAndHelpers`: This is the exact same thing you're `children` prop
  function is called with (see [Child Callback Function](#child-callback-function))

> Tip: This function will be called any time _any_ state is changed. The best
> way to determine whether any particular state was changed, you can use
> `changes.hasOwnProperty('propName')`.

> Note: the `changes` object will also have a `type` property that corresponds
> to a `Downshift.stateChangeTypes` property. This is an experimental feature
> so it's not recommended to use it if you can avoid it. If you need it, please
> open an issue to discuss solidifying the API.

### itemCount

> `number` | optional, defaults the number of times you call getItemProps

This is useful if you're using some kind of virtual listing component for
"windowing" (like [`react-virtualized`](https://github.com/bvaughn/react-virtualized)).

### highlightedIndex

> `number` | **control prop** (read more about this in the "Control Props" section below)

The index that should be highlighted

### inputValue

> `string` | **control prop** (read more about this in the "Control Props" section below)

The value the input should have

### isOpen

> `boolean` | **control prop** (read more about this in the "Control Props" section below)

Whether the menu should be considered open or closed. Some aspects of the
downshift component respond differently based on this value (for example, if
`isOpen` is true when the user hits "Enter" on the input field, then the
item at the `highlightedIndex` item is selected).

### `selectedItem`

> `any`/`Array(any)` | **control prop** (read more about this in the "Control Props" section below)

The currently selected item.

### children

> `function({})` | *required*

This is called with an object. Read more about the properties of this object
in the section "Child Callback Function"

## Control Props

downshift manages its own state internally and calls your `onChange` and
`onStateChange` handlers with any relevant changes. The state that downshift
manages includes: `isOpen`, `selectedItem`, `inputValue`, and
`highlightedIndex`. Your child callback function (read more below) can be used
to manipulate this state from within the render function and can likely support
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
> can learn about that from this the
> ["Controlled Components" lecture][controlled-components-lecture] and
> exercises from [React Training's][react-training]
> [Advanced React][advanced-react] course.

## Child Callback Function

This is where you render whatever you want to based on the state of `downshift`.
The function is passed as the child prop:
`<Downshift>{/* right here*/}</Downshift>`

The properties of this object can be split into three categories as indicated
below:

### prop getters

These functions are used to apply props to the elements that you render.
This gives you maximum flexibility to render what, when, and wherever you like.
You call these on the element in question (for example:
`<input {...getInputProps()}`)). It's advisable to pass all your props to that
function rather than applying them on the element yourself to avoid your props
being overridden (or overriding the props returned). For example:
`getInputProps({onKeyUp(event) {console.log(event)}})`.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property         | type           | description                                                                                 |
|------------------|----------------|---------------------------------------------------------------------------------------------|
| `getButtonProps` | `function({})` | returns the props you should apply to any menu toggle button element you render.            |
| `getInputProps`  | `function({})` | returns the props you should apply to the `input` element that you render.                  |
| `getItemProps`   | `function({})` | returns the props you should apply to any menu item elements you render.                    |
| `getLabelProps`  | `function({})` | returns the props you should apply to the `label` element that you render.                  |
| `getRootProps`   | `function({})` | returns the props you should apply to the root element that you render. It can be optional. |

#### `getRootProps`

Most of the time, you can just render a `div` yourself and `Downshift` will
apply the props it needs to do its job (and you don't need to call this
function). However, if you're rendering a composite component (custom component)
as the root element, then you'll need to call `getRootProps` and apply that to
your root element.

Required properties:

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getRootProps({refKey: 'innerRef'})`
  and your composite component would forward like:
  `<div ref={props.innerRef} />`

#### `getInputProps`

This method should be applied to the `input` you render. It is recommended that
you pass all props as an object to this method which will compose together any
of the event handlers you need to apply to the `input` while preserving the
ones that `downshift` needs to apply to make the `input` behave.

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
    return null // but we're not using props, and downshift things we are...
  }
  return <div {...props} />
})
```

Instead, you could do this:

```jsx
items
  .filter(shouldRenderItem)
  .map(item => <div {...getItemProps({item})} />)
```

</details>

Required properties:

- `item`: this is the item data that will be selected when the user selects a
  particular item.

Optional properties:

- `index`: this is how `downshift` keeps track of your item when updating the
  `highlightedIndex` as the user keys around. By default, `downshift` will
  assume the `index` is the order in which you're calling `getItemProps`. This
  is often good enough, but if you find odd behavior, try setting this
  explicitly. It's probably best to be explicit about `index` when using a
  windowing library like `react-virtualized`.

#### `getButtonProps`

Call this and apply the returned props to a `button`. It allows you to toggle
the `Menu` component. You can definitely build something like this yourself
(all of the available APIs are exposed to you), but this is nice because it
will also apply all of the proper ARIA attributes. The `aria-label` prop is in
English. You should probably override this yourself so you can provide
translations:

```jsx
<button {...getButtonProps({
  'aria-label': translateWithId(isOpen ? 'close.menu' : 'open.menu'),
})} />
```

### actions

These are functions you can call to change the state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property                | type                                                             | description                                                                  |
|-------------------------|------------------------------------------------------------------|------------------------------------------------------------------------------|
| `clearSelection`        | `function(cb: Function)`                                         | clears the selection                                                         |
| `closeMenu`             | `function(cb: Function)`                                         | closes the menu                                                              |
| `openMenu`              | `function(cb: Function)`                                         | opens the menu                                                               |
| `selectHighlightedItem` | `function(otherStateToSet: object, cb: Function)`                | selects the item that is currently highlighted                               |
| `selectItem`            | `function(item: any, otherStateToSet: object, cb: Function)`     | selects the given item                                                       |
| `selectItemAtIndex`     | `function(index: number, otherStateToSet: object, cb: Function)` | selects the item at the given index                                          |
| `setHighlightedIndex`   | `function(index: number, otherStateToSet: object, cb: Function)` | call to set a new highlighted index                                          |
| `toggleMenu`            | `function(otherStateToSet: object, cb: Function)`                | toggle the menu open state                                                   |
| `reset`                 | `function(otherStateToSet: object, cb: Function)`                | this resets downshift's state to a reasonable default                        |
| `itemToString`          | `function(item: any)`                                            | this is the same as the `itemToString` prop and is provided just as a helper |

> `otherStateToSet` refers to an object to set other internal state. It is
> recommended to avoid abusing this, but is available if you need it.

### state

These are values that represent the current state of the downshift component.

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property           | type              | description                                    |
|--------------------|-------------------|------------------------------------------------|
| `highlightedIndex` | `number` / `null` | the currently highlighted item                 |
| `inputValue`       | `string` / `null` | the current value of the `getInputProps` input |
| `isOpen`           | `boolean`         | the menu open state                            |
| `selectedItem`     | `any`             | the currently selected item input              |

## Examples

Examples exist on [codesandbox.io][examples]:

- [Bare bones autocomplete](https://codesandbox.io/s/6z67jvklw3)
- [Multiple selection](https://codesandbox.io/s/W6gyJ30kn) (uses controlled `selectedItem` API).
- [Type Ahead Example](https://codesandbox.io/s/82m2px40q9) (uses controlled `selectedItem` API).
- [Integration with Apollo](https://codesandbox.io/s/m5zrvqj85p)
- [Integration with Redux](https://codesandbox.io/s/0o0w70lp8p)
- [Integration with `react-instantsearch`](https://codesandbox.io/s/kvn0lpp83) from Algolia
- [Material UI (1.0.0-beta.4) Combobox Using Downshift](https://codesandbox.io/s/QMGq4kAY)
- [Integration with `GenieJS`](https://codesandbox.io/s/jRLKrxwgl) ([learn more about `genie` here](https://github.com/kentcdodds/genie))
- [Handling and displaying errors](https://codesandbox.io/s/zKE37vorr)
- [Integration with React Router](https://codesandbox.io/s/ww9lwloy8w)
- [Windowing with `react-tiny-virtual-list`](https://codesandbox.io/s/o5yk7pzmmy)
- [Section/option group example](https://codesandbox.io/s/zx1kj58npl)

<!--

This needs to be updated to the latest version of downshift:

- [downshift Spectre.css example](https://codesandbox.io/s/M89KQOBRB)

-->

If you would like to add an example, follow these steps:

1. Fork [this codesandbox](http://kcd.im/ds-example)
2. Make sure your version (under dependencies) is the latest available version.
3. Update the title and description
4. Update the code for your example (add some form of documentation to explain what it is)
5. Add the tag: `downshift:example`

You'll find other examples in the `stories/examples` folder of the repo.
And you'll find
[a live version of those examples here](https://downshift.netlify.com)


## Inspiration

I was heavily inspired by [Ryan Florence][ryan]. Watch his (free) lesson about
["Compound Components"][compound-components-lecture]. Initially downshift was
a group of compound components using context to communicate. But then
[Jared Forsyth][jared] suggested I expose functions (the prop getters) to get
props to apply to the elements rendered. That bit of inspiration made a big
impact on the flexibility and simplicity of this API.

I also took a few ideas from the code in
[`react-autocomplete`][react-autocomplete] and
[jQuery UI's Autocomplete][jquery-complete].

You can watch me build the first iteration of `downshift` on YouTube:

- [Part 1](https://www.youtube.com/watch?v=2kzD1IjDy5s&list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE&index=11)
- [Part 2](https://www.youtube.com/watch?v=w1Z7Jvj08_s&list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE&index=10)

You'll find more recordings of me working on `downshift` on
[my livestream YouTube playlist][yt-playlist].

## Other Solutions

You can implement these other solutions using `downshift`, but if
you'd prefer to use these out of the box solutions, then that's fine too:

- [`react-select`](https://github.com/JedWatson/react-select)
- [`react-autocomplete`](https://github.com/reactjs/react-autocomplete)

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/paypal/downshift/commits?author=kentcdodds "Code") [📖](https://github.com/paypal/downshift/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/paypal/downshift/commits?author=kentcdodds "Tests") | [<img src="https://avatars0.githubusercontent.com/u/100200?v=4" width="100px;"/><br /><sub>Ryan Florence</sub>](http://twitter.com/ryanflorence)<br />[🤔](#ideas-ryanflorence "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/112170?v=4" width="100px;"/><br /><sub>Jared Forsyth</sub>](http://jaredforsyth.com)<br />[🤔](#ideas-jaredly "Ideas, Planning, & Feedback") [📖](https://github.com/paypal/downshift/commits?author=jaredly "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/8162598?v=4" width="100px;"/><br /><sub>Jack Moore</sub>](https://github.com/jtmthf)<br />[💡](#example-jtmthf "Examples") | [<img src="https://avatars1.githubusercontent.com/u/2762082?v=4" width="100px;"/><br /><sub>Travis Arnold</sub>](http://travisrayarnold.com)<br />[💻](https://github.com/paypal/downshift/commits?author=souporserious "Code") [📖](https://github.com/paypal/downshift/commits?author=souporserious "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/244704?v=4" width="100px;"/><br /><sub>Jeremy Gayed</sub>](http://www.jeremygayed.com)<br />[💡](#example-tizmagik "Examples") | [<img src="https://avatars3.githubusercontent.com/u/6270048?v=4" width="100px;"/><br /><sub>Haroen Viaene</sub>](https://haroen.me)<br />[💡](#example-Haroenv "Examples") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars2.githubusercontent.com/u/15073300?v=4" width="100px;"/><br /><sub>monssef</sub>](https://github.com/rezof)<br />[💡](#example-rezof "Examples") | [<img src="https://avatars2.githubusercontent.com/u/5382443?v=4" width="100px;"/><br /><sub>Federico Zivolo</sub>](https://fezvrasta.github.io)<br />[📖](https://github.com/paypal/downshift/commits?author=FezVrasta "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/746482?v=4" width="100px;"/><br /><sub>Divyendu Singh</sub>](https://divyendusingh.com)<br />[💡](#example-divyenduz "Examples") | [<img src="https://avatars1.githubusercontent.com/u/841955?v=4" width="100px;"/><br /><sub>Muhammad Salman</sub>](https://github.com/salmanmanekia)<br />[💻](https://github.com/paypal/downshift/commits?author=salmanmanekia "Code") | [<img src="https://avatars3.githubusercontent.com/u/10820159?v=4" width="100px;"/><br /><sub>João Alberto</sub>](https://twitter.com/psicotropidev)<br />[💻](https://github.com/paypal/downshift/commits?author=psicotropicos "Code") | [<img src="https://avatars0.githubusercontent.com/u/16327281?v=4" width="100px;"/><br /><sub>Bernard Lin</sub>](https://github.com/bernard-lin)<br />[💻](https://github.com/paypal/downshift/commits?author=bernard-lin "Code") [📖](https://github.com/paypal/downshift/commits?author=bernard-lin "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/7330124?v=4" width="100px;"/><br /><sub>Geoff Davis</sub>](https://geoffdavis.info)<br />[💡](#example-geoffdavis92 "Examples") |
| [<img src="https://avatars0.githubusercontent.com/u/3415488?v=4" width="100px;"/><br /><sub>Anup</sub>](https://github.com/reznord)<br />[📖](https://github.com/paypal/downshift/commits?author=reznord "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/340520?v=4" width="100px;"/><br /><sub>Ferdinand Salis</sub>](http://ferdinandsalis.com)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Aferdinandsalis "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=ferdinandsalis "Code") | [<img src="https://avatars2.githubusercontent.com/u/662750?v=4" width="100px;"/><br /><sub>Kye Hohenberger</sub>](https://github.com/tkh44)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Atkh44 "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/1443499?v=4" width="100px;"/><br /><sub>Julien Goux</sub>](https://github.com/jgoux)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Ajgoux "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=jgoux "Code") [⚠️](https://github.com/paypal/downshift/commits?author=jgoux "Tests") | [<img src="https://avatars2.githubusercontent.com/u/9586897?v=4" width="100px;"/><br /><sub>Joachim Seminck</sub>](https://github.com/jseminck)<br />[💻](https://github.com/paypal/downshift/commits?author=jseminck "Code") | [<img src="https://avatars3.githubusercontent.com/u/954596?v=4" width="100px;"/><br /><sub>Jesse Harlin</sub>](http://jesseharlin.net/)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Athe-simian "Bug reports") [💡](#example-the-simian "Examples") | [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;"/><br /><sub>Matt Parrish</sub>](https://github.com/pbomb)<br />[🔧](#tool-pbomb "Tools") |
| [<img src="https://avatars1.githubusercontent.com/u/11661846?v=4" width="100px;"/><br /><sub>thom</sub>](http://thom.kr)<br />[💻](https://github.com/paypal/downshift/commits?author=thomhos "Code") | [<img src="https://avatars2.githubusercontent.com/u/1088312?v=4" width="100px;"/><br /><sub>Vu Tran</sub>](http://twitter.com/tranvu)<br />[💻](https://github.com/paypal/downshift/commits?author=vutran "Code") | [<img src="https://avatars1.githubusercontent.com/u/74193?v=4" width="100px;"/><br /><sub>Codie Mullins</sub>](https://github.com/codiemullins)<br />[💻](https://github.com/paypal/downshift/commits?author=codiemullins "Code") [💡](#example-codiemullins "Examples") | [<img src="https://avatars3.githubusercontent.com/u/12202757?v=4" width="100px;"/><br /><sub>Mohammad Rajabifard</sub>](https://morajabi.me)<br />[📖](https://github.com/paypal/downshift/commits?author=morajabi "Documentation") [🤔](#ideas-morajabi "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/9488719?v=4" width="100px;"/><br /><sub>Frank Tan</sub>](https://github.com/tansongyang)<br />[💻](https://github.com/paypal/downshift/commits?author=tansongyang "Code") | [<img src="https://avatars3.githubusercontent.com/u/5093058?v=4" width="100px;"/><br /><sub>Kier Borromeo</sub>](https://kierb.com)<br />[💡](#example-srph "Examples") |
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
[fac]: https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9
