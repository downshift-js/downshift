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
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-16-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

You need an autocomplete/dropdown/select experience in your application and you
want it to be accessible. You also want it to be simple and flexible to account
for your use cases.

## This solution

This is a collection of primitive components that you can compose together to
create an autocomplete component which you can reuse in your application. It's
based on ideas from the talk ["Compound Components"][compound-components-talk]
which effectively gives you maximum flexibility with a minimal API because you
are responsible for the rendering of everything and you simply apply props to
what you're rendering.

This differs from other solutions which render things for their use case and
then expose many options to allow for extensibility causing an API that is less
easy to use and less flexible as well as making the implementation more
complicated and harder to contribute to.

> NOTE: The original use case of this component is autocomplete, however the API
> is powerful and flexible enough to build things like dropdowns as well.

## Installation

**This component is currently under development and is not yet released...**

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save downshift@beta
```

> This package also depends on `react` and `prop-types`. Please make sure you
> have those installed as well.

> Note also this library supports `preact` out of the box. If you are using
> `preact` then look in the `dist/` folder and use the module you want with the
> `preact` suffix.

## Usage

**Things are still in flux a little bit (looking for feedback).**

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
                    {...getItemProps({item, index})}
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
      onChange={({selectedItem}) => console.log(selectedItem)}
    />
  )
}
```

Available components and relevant props:

### Downshift

This is the only component. It doesn't render anything itself, it just calls
the child function and renders that. Wrap everything in this.

#### defaultSelectedItem

> `any` | defaults to `null`

Pass an item or an array of items that should be selected by default.

#### defaultHighlightedIndex

> `number`/`null` | defaults to `null`

This is the initial index to highlight when the menu first opens.

#### defaultInputValue

> `string` | defaults to `''`

This is the initial input value.

#### defaultIsOpen

> `boolean` | defaults to `false`

This is the initial `isOpen` value.

#### itemToString

> `function(item: any)` | defaults to: `i => (i == null ? '' : String(i))`

Used to determine the string value for the selected item (which is used to
compute the `inputValue`.

#### getA11yStatusMessage

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

#### onChange

> `function({selectedItem, previousItem})` | optional, no useful default

Called when the user selects an item

#### onStateChange

> `function(changes, allState)` | optional, no useful default

This function is called anytime the internal state changes. This can be useful
if you're using downshift as a "controlled" component, where you manage some or
all of the state (e.g. isOpen, selectedItem, highlightedIndex, etc) and then
pass it as props, rather than letting downshift control all its state itself.
The parameters both take the shape of internal state
(`{highlightedIndex: number, inputValue: string, isOpen: boolean, selectedItem: any}`)
but differ slightly.

- `changes`: These are the properties that actually have changed since the last
  state change
- `allState`: This is the full state object of all the state in your `downshift`
  component.

#### itemCount

> `number` | optional, defaults the number of times you call getItemProps

This is useful if you're using some kind of virtual listing component for
"windowing" (like [`react-virtualized`](https://github.com/bvaughn/react-virtualized)).

#### highlightedIndex

> `number` | **state prop** (read more below)

The index that should be highlighted

#### inputValue

> `string` | **state prop** (read more below)

The value the input should have

#### isOpen

> `boolean` | **state prop** (read more below)

Whether the menu should be considered open or closed. Some aspects of the
downshift component respond differently based on this value (for example, if
`isOpen` is true when the user hits "Enter" on the input field, then the
item at the `highlightedIndex` item is selected).

#### `selectedItem`

> `any`/`Array(any)` | **state prop** (read more below)

The currently selected item.

#### children

> `function({})` | *required*

This is called with an object. The properties of this object can be split into
three categories as indicated below:

##### prop getters

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

##### `getRootProps`

Most of the time, you can just render a `div` yourself and `Downshift` will
apply the props it needs to do its job (and you don't need to call this
function). However, if you're rendering a composite component (custom component)
as the root element, then you'll need to call `getRootProps` and apply that to
your root element.

Required properties:

- `refKey`: if you're rendering a composite component, that component will need
  to accept a prop which it forwards to the root DOM element. Commonly, folks
  call this `innerRef`. So you'd call: `getRootProps({refKey: 'innerRef'})`
  and your composite component would forward like: `<div ref={props.innerRef} />`

##### `getInputProps`

This method should be applied to the `input` you render. It is recommended that
you pass all props as an object to this method which will compose together any
of the event handlers you need to apply to the `input` while preserving the
ones that `downshift` needs to apply to make the `input` behave.

There are no required properties for this method.

##### `getLabelProps`

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

##### `getItemProps`

This method should be applied to any menu items you render. You pass it an object
and that object must contain `index` (number) and `item` (anything) properties.

Required properties:

- `index`: this is how `downshift` keeps track of your item when
  updating the `highlightedIndex` as the user keys around.
- `item`: this is the item data that will be selected when the user selects a
  particular item.

##### `getButtonProps`

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

##### actions

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property                | type                       | description                                                                                                      |
|-------------------------|----------------------------|------------------------------------------------------------------------------------------------------------------|
| `clearSelection`        | `function()`               | clears the selection                                                                                             |
| `closeMenu`             | `function()`               | closes the menu                                                                                                  |
| `openMenu`              | `function()`               | opens the menu                                                                                                   |
| `selectHighlightedItem` | `function()`               | selects the item that is currently highlighted                                                                   |
| `selectItem`            | `function(item: any)`      | selects the given item                                                                                           |
| `selectItemAtIndex`     | `function(index: number)`  | selects the item at the given index                                                                              |
| `setHighlightedIndex`   | `function(index: number)`  | call to set a new highlighted index                                                                              |
| `toggleMenu`            | `function(state: boolean)` | toggle the menu open state (if `state` is not provided, then it will be set to the inverse of the current state) |

##### state

| property           | type              | description                                    |
|--------------------|-------------------|------------------------------------------------|
| `highlightedIndex` | `number` / `null` | the currently highlighted item                 |
| `inputValue`       | `string` / `null` | the current value of the `getInputProps` input |
| `isOpen`           | `boolean`         | the menu open state                            |
| `selectedItem`     | `any`             | the currently selected item input              |

## Examples

Examples exist on [codesandbox.io][examples]:

- [multiple selection example](https://codesandbox.io/s/W6gyJ30kn) (uses controlled `selectedItem` API).
- [downshift Apollo example](https://codesandbox.io/s/j2omZpK3W)
- [downshift Spectre.css example](https://codesandbox.io/s/M89KQOBRB)
- [Material UI (1.0.0-beta.4) Combobox Using Downshift](https://codesandbox.io/s/QMGq4kAY)

If you would like to add an example, follow these steps:

1. Fork [this codesandbox](http://kcd.im/rac-example)
2. Update the code for your example (add some form of documentation to explain what it is)
3. Update the title and description
4. Add the tag: `downshift:example`

## Inspiration

I was heavily inspired by [Ryan Florence][ryan] and his talk entitled:
["Compound Components"][compound-components-talk]. I also took a few ideas from
the code in [`react-autocomplete`][react-autocomplete] and
[jQuery UI's Autocomplete][jquery-complete].

You can watch me build the first iteration of `downshift` on YouTube:

- [Part 1](https://youtu.be/2kzD1IjDy5s)
- [Part 2](https://youtu.be/w1Z7Jvj08_s)

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
| [<img src="https://avatars0.githubusercontent.com/u/3415488?v=4" width="100px;"/><br /><sub>Anup</sub>](https://github.com/reznord)<br />[📖](https://github.com/paypal/downshift/commits?author=reznord "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/340520?v=4" width="100px;"/><br /><sub>Ferdinand Salis</sub>](http://ferdinandsalis.com)<br />[🐛](https://github.com/paypal/downshift/issues?q=author%3Aferdinandsalis "Bug reports") [💻](https://github.com/paypal/downshift/commits?author=ferdinandsalis "Code") | [<img src="https://avatars0.githubusercontent.com/u/6290720?v=4" width="100px;"/><br /><sub>David Nguyen</sub>](http://github.com/nndung179/)<br />[💡](https://codesandbox.io/s/gOmNGvN6 "Material DownShift Example") | [<img src="https://avatars0.githubusercontent.com/u/954596?v=4" width="100px;"/><br /><sub>the_Simian</sub>](https://github.com/the-simian)<br />[💡](https://codesandbox.io/s/QMGq4kAY "Material UI v1 Combobox in Downshift")[🐛](https://github.com/paypal/downshift/issues?utf8=%E2%9C%93&q=author%3Athe-simian "Bug Reports")
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
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/paypal/downshift/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/paypal/downshift.svg?style=social
[github-watch]: https://github.com/paypal/downshift/watchers
[github-star-badge]: https://img.shields.io/github/stars/paypal/downshift.svg?style=social
[github-star]: https://github.com/paypal/downshift/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20downshift!%20https://github.com/paypal/downshift%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/paypal/downshift.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[ryan]: https://github.com/ryanflorence
[compound-components-talk]: https://www.youtube.com/watch?v=hEGg-3pIHlE
[react-autocomplete]: https://www.npmjs.com/package/react-autocomplete
[jquery-complete]: https://jqueryui.com/autocomplete/
[examples]: https://codesandbox.io/search?refinementList%5Btags%5D%5B0%5D=downshift%3Aexample&page=1
