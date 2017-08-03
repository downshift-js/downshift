<div align="center">
<h1>react-kadabra 🔮</h1>

Primitives to build simple, flexible, WAI-ARIA compliant React
autocomplete/dropdown/select/combobox components
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)
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
are responsible for the rendering of the autocomplete components.

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
npm install --save react-kadabra@beta
```

> This package also depends on `react` and `prop-types`. Please make sure you have
> those installed as well.

## Usage

**Things are still in flux a little bit (looking for feedback).**

```jsx
import Autocomplete from 'react-kadabra'

function BasicAutocomplete({items, onChange}) {
  return (
    <Autocomplete onChange={onChange}>
      {({
        getInputProps,
        getItemProps,
        isOpen,
        value,
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
                    !value ||
                    i.toLowerCase().includes(value.toLowerCase()),
                )
                .map((value, index) => (
                  <div
                    {...getItemProps({value, index})}
                    key={value}
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    }
                  >
                    {item}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
    </Autocomplete>
  )
}

function App() {
  return (
    <BasicAutocomplete
      items={['apple', 'orange', 'carrot']}
      onChange={item => console.log(item)}
    />
  )
}
```

Available components and relevant props:

### Autocomplete

This is the only component. It doesn't render anything itself, it just calls the child function and renders that. Wrap
everything in this.

#### getValue

> `function(item: any)` | defaults to an identity function (`i => String(i)`)

Used to determine the `value` for the selected item.

#### defaultSelectedItem

> `any` | defaults to `null`

Pass an item that should be selected by default.

#### defaultHighlightedIndex

> `number`/`null` | defaults to `null`

This is the initial index to highlight when the autocomplete first opens.

#### getA11yStatusMessage

> `function({ resultCount, highlightedItem, getValue})` | default messages provided in English

This function is passed as props to a `Status` component nested within and allows you to create your own assertive ARIA statuses.

A default `getA11yStatusMessage` function is provided that will check `resultCount` and return "No results." or if there are results but no item is highlighted, "`resultCount` results are available, use up and down arrow keys to navigate."  If an item is highlighted it will run `getValue(highlightedItem)` and display the value of the `highlightedItem`.

#### onChange

> `function(item: any)` | *required*

Called when the user selects an item

#### children

> `function({})` | *required*

This is called with an object with the properties listed below:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property                | type                       | description                                                                                                      |
|-------------------------|----------------------------|------------------------------------------------------------------------------------------------------------------|
| `getRootProps`          | `function({})`             | returns the props you should apply to the root element that you render. It can be optional. Read more below      |
| `getInputProps`         | `function({})`             | returns the props you should apply to the `input` element that you render. Read more below                       |
| `getItemProps`          | `function({})`             | returns the props you should apply to any menu item elements you render. Read more below                         |
| `getButtonProps`        | `function({})`             | returns the props you should apply to any menu toggle button element you render. Read more below                 |
| `highlightedIndex`      | `number` / `null`          | the currently highlighted item                                                                                   |
| `setHighlightedIndex`   | `function(index: number)`  | call to set a new highlighted index                                                                              |
| `value`                 | `string` / `null`          | the current value of the autocomplete                                                                            |
| `isOpen`                | `boolean`                  | the menu open state                                                                                              |
| `toggleMenu`            | `function(state: boolean)` | toggle the menu open state (if `state` is not provided, then it will be set to the inverse of the current state) |
| `openMenu`              | `function()`               | opens the menu                                                                                                   |
| `closeMenu`             | `function()`               | closes the menu                                                                                                  |
| `selectedItem`          | `any`                      | the currently selected item                                                                                      |
| `clearSelection`        | `function()`               | clears the selection                                                                                             |
| `selectItem`            | `function(item: any)`      | selects the given item                                                                                           |
| `selectItemAtIndex`     | `function(index: number)`  | selects the item at the given index                                                                              |
| `selectHighlightedItem` | `function()`               | selects the item that is currently highlighted                                                                   |

The functions below are used to apply props to the elements that you render.
This gives you maximum flexibility to render what, when, and wherever you like.
You call these on the element in question (for example:
`<input {...getInputProps()}`)). It's advisable to pass all your props to that
function rather than applying them on the element yourself to avoid your props
being overridden (or overriding the props returned). For example:
`getInputProps({onKeyUp(event) {console.log(event)}})`.

##### `getRootProps`

Most of the time, you can just render a `div` yourself and `Autocompletely` will
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
ones that `react-kadabra` needs to apply to make the `input` behave.

There are no required properties for this method.

##### `getItemProps`

This method should be applied to any menu items you render. You pass it an object
and that object must contain `index` (number) and `value` (anything) properties.

Required properties:

- `index`: this is how `react-kadabra` keeps track of your item when
  updating the `highlightedIndex` as the user keys around.
- `value`: this is the item data that will be selected when the user selects a
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

## Examples

Examples exist on [codesandbox.io][examples]:

- [react-kadabra Apollo example](https://codesandbox.io/s/j2omZpK3W)
- [react-kadabra Spectre.css example](https://codesandbox.io/s/M89KQOBRB)

If you would like to add an example, follow these steps:

1. Fork [this codesandbox](http://kcd.im/rac-example)
2. Update the code for your example (add some form of documentation to explain what it is)
3. Update the title and description
4. Add the tag: `react-kadabra:example`

## Inspiration

I was heavily inspired by [Ryan Florence][ryan] and his talk entitled:
["Compound Components"][compound-components-talk]. I also took a few ideas from
the code in [`react-autocomplete`][react-autocomplete] and
[jQuery UI's Autocomplete][jquery-complete].

You can watch me build the first iteration of `react-kadabra` on YouTube:

- [Part 1](https://youtu.be/2kzD1IjDy5s)
- [Part 2](https://youtu.be/w1Z7Jvj08_s)

## Other Solutions

You can implement these other solutions using `react-kadabra`, but if
you'd prefer to use these out of the box solutions, then that's fine too:

- [`react-select`](https://github.com/JedWatson/react-select)
- [`react-autocomplete`](https://github.com/reactjs/react-autocomplete)

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/paypal/react-kadabra/commits?author=kentcdodds "Code") [📖](https://github.com/paypal/react-kadabra/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/paypal/react-kadabra/commits?author=kentcdodds "Tests") | [<img src="https://avatars1.githubusercontent.com/u/8162598?v=4" width="100px;"/><br /><sub>Jack Moore</sub>](https://github.com/jtmthf)<br />[💡](#example-jtmthf "Examples") | [<img src="https://avatars1.githubusercontent.com/u/2762082?v=4" width="100px;"/><br /><sub>Travis Arnold</sub>](http://travisrayarnold.com)<br />[💻](https://github.com/paypal/react-kadabra/commits?author=souporserious "Code") [📖](https://github.com/paypal/react-kadabra/commits?author=souporserious "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/244704?v=4" width="100px;"/><br /><sub>Jeremy Gayed</sub>](http://www.jeremygayed.com)<br />[💡](#example-tizmagik "Examples") | [<img src="https://avatars3.githubusercontent.com/u/6270048?v=4" width="100px;"/><br /><sub>Haroen Viaene</sub>](https://haroen.me)<br />[💡](#example-Haroenv "Examples") | [<img src="https://avatars2.githubusercontent.com/u/15073300?v=4" width="100px;"/><br /><sub>monssef</sub>](https://github.com/rezof)<br />[💡](#example-rezof "Examples") | [<img src="https://avatars2.githubusercontent.com/u/5382443?v=4" width="100px;"/><br /><sub>Federico Zivolo</sub>](https://fezvrasta.github.io)<br />[📖](https://github.com/paypal/react-kadabra/commits?author=FezVrasta "Documentation") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/746482?v=4" width="100px;"/><br /><sub>Divyendu Singh</sub>](https://divyendusingh.com)<br />[💡](#example-divyenduz "Examples") | [<img src="https://avatars1.githubusercontent.com/u/841955?v=4" width="100px;"/><br /><sub>Muhammad Salman</sub>](https://github.com/salmanmanekia)<br />[💻](https://github.com/paypal/react-kadabra/commits?author=salmanmanekia "Code") | [<img src="https://avatars3.githubusercontent.com/u/10820159?v=4" width="100px;"/><br /><sub>João Alberto</sub>](https://twitter.com/psicotropidev)<br />[💻](https://github.com/paypal/react-kadabra/commits?author=psicotropicos "Code") | [<img src="https://avatars0.githubusercontent.com/u/16327281?v=4" width="100px;"/><br /><sub>Bernard Lin</sub>](https://github.com/bernard-lin)<br />[💻](https://github.com/paypal/react-kadabra/commits?author=bernard-lin "Code") [📖](https://github.com/paypal/react-kadabra/commits?author=bernard-lin "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/7330124?v=4" width="100px;"/><br /><sub>Geoff Davis</sub>](https://geoffdavis.info)<br />[💡](#example-geoffdavis92 "Examples") | [<img src="https://avatars0.githubusercontent.com/u/3415488?v=4" width="100px;"/><br /><sub>Anup</sub>](https://github.com/reznord)<br />[📖](https://github.com/paypal/react-kadabra/commits?author=reznord "Documentation") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/paypal/react-kadabra.svg?style=flat-square
[build]: https://travis-ci.org/paypal/react-kadabra
[coverage-badge]: https://img.shields.io/codecov/c/github/paypal/react-kadabra.svg?style=flat-square
[coverage]: https://codecov.io/github/paypal/react-kadabra
[version-badge]: https://img.shields.io/npm/v/react-kadabra.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-kadabra
[downloads-badge]: https://img.shields.io/npm/dm/react-kadabra.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/react-kadabra
[license-badge]: https://img.shields.io/npm/l/react-kadabra.svg?style=flat-square
[license]: https://github.com/paypal/react-kadabra/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/paypal/react-kadabra/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/paypal/react-kadabra.svg?style=social
[github-watch]: https://github.com/paypal/react-kadabra/watchers
[github-star-badge]: https://img.shields.io/github/stars/paypal/react-kadabra.svg?style=social
[github-star]: https://github.com/paypal/react-kadabra/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20react-kadabra!%20https://github.com/paypal/react-kadabra%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/paypal/react-kadabra.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[ryan]: https://github.com/ryanflorence
[compound-components-talk]: https://www.youtube.com/watch?v=hEGg-3pIHlE
[react-autocomplete]: https://www.npmjs.com/package/react-autocomplete
[jquery-complete]: https://jqueryui.com/autocomplete/
[examples]: https://codesandbox.io/search?refinementList%5Btags%5D%5B0%5D=react-kadabra%3Aexample&page=1
