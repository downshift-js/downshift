<div align="center">
<h1>react-completely 🔮</h1>

Primitives to build simple, flexible, WAI-ARIA compliant React autocomplete components
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

You need an autocomplete experience in your application and you want it to be
accessible. You also want it to be simple and flexible to account for your use
cases.

## This solution

This is a collection of primitive components that you can compose together to
create an autocomplete component which you can reuse in your application. It's
based on ideas from the talk ["Compound Components"][compound-components-talk]
which effectively gives you maximum flexibility with a minimal API because you
are responsible for the rendering of the autocomplete components.

## Installation

**This component is currently under development and is not yet released...**

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-completely
```

> This package also depends on `react` and `prop-types`. Please make sure you have
> those installed as well.

## Usage

**Things are still in flux a little bit (looking for feedback).**

```jsx
import Autocomplete from 'react-autocompletely'

// use components together here.
```

Available components and relevant props:

### Autocomplete

This is the main component. It renders a `div` and forwards props. Wrap
everything in this.

#### onChange

> `function(item: any)` | *required*

Called when the user selects an item

### Autocomplete.Input

This is the input component. It renders an `input` and forwards props.

#### defaultValue

> `string` / `null` | *defaults to null*

The initial value the input should have when it's mounted.

#### getValue

> `function(item: any)` | defaults to an identity function (`i => String(i)`)

Used to determine the `inputValue` for the selected item.

### Autocomplete.Controller

This component allows you to receive and interact with the state of the
autocomplete component.

#### children

> `function({})` | *required*

This is called with an object with the properties listed below:

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| property                | type                       | description                                                                                                      |
|-------------------------|----------------------------|------------------------------------------------------------------------------------------------------------------|
| `highlightedIndex`      | `number` / `null`          | the currently highlighted item                                                                                   |
| `setHighlightedIndex`   | `function(index: number)`  | call to set a new highlighted index                                                                              |
| `inputValue`            | `string` / `null`          | the current value of the input                                                                                   |
| `isOpen`                | `boolean`                  | the menu open state                                                                                              |
| `toggleMenu`            | `function(state: boolean)` | toggle the menu open state (if `state` is not provided, then it will be set to the inverse of the current state) |
| `openMenu`              | `function()`               | opens the menu                                                                                                   |
| `closeMenu`             | `function()`               | closes the menu                                                                                                  |
| `selectedItem`          | `any`                      | the currently selected item                                                                                      |
| `clearSelection`        | `function()`               | clears the selection                                                                                             |
| `selectItem`            | `function(item: any)`      | selects the given item                                                                                           |
| `selectItemAtIndex`     | `function(index: number)`  | selects the item at the given index                                                                              |
| `selectHighlightedItem` | `function()`               | selects the item that is currently highlighted                                                                   |

### Autocomplete.Menu

This component allows you to render the items based on the user input. It
renders a `div` with another `div` for your items and a `div` for the menu
status (for accessibility purposes)

#### children

> `function({})` | *required*

This is called with the same things that the `children` prop is called with for
`Autocomplete.Controller`

### Autocomplete.ItemContainer

Use this component if you don't render the items as direct children of the
`Autocomplete.Menu`. It renders a `div` and forwards all props. There should
only be one of these in a menu and it should be the scrollable area where
the items are rendered.

### Autocomplete.Item

Render your items inside this component. This renders a `div` and forwards all
props.

#### index

> `number` | *required*

this is how `react-autocompletely` keeps track of your item when updating the
`highlightedIndex` as the user keys around.

#### item

> `any` | *required*

This is the item data that will be selected when the user selects a particular
item.

## Examples

Please see the `examples` directory for examples of how to compose these
components together.

## Inspiration

I was heavily inspired by [Ryan Florence][ryan] and his talk entitled:
["Compound Components"][compound-components-talk]. I also took a few ideas from
the code in [`react-autocomplete`][react-autocomplete] and
[jQuery UI's Autocomplete][jquery-complete].

You can watch me build the first iteration of `react-autocompletely` on YouTube:

- [Part 1](https://youtu.be/2kzD1IjDy5s)
- [Part 2](https://youtu.be/w1Z7Jvj08_s)

## Other Solutions

You can implement these other solutions using `react-autocompletely`, but if
you'd prefer to use these out of the box solutions, then that's fine too:

- [`react-select`](https://github.com/JedWatson/react-select)
- [`react-autocomplete`](https://github.com/reactjs/react-autocomplete)

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/react-completely/commits?author=kentcdodds "Code") [📖](https://github.com/kentcdodds/react-completely/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/kentcdodds/react-completely/commits?author=kentcdodds "Tests") | [<img src="https://avatars1.githubusercontent.com/u/8162598?v=4" width="100px;"/><br /><sub>Jack Moore</sub>](https://github.com/jtmthf)<br />[💡](#example-jtmthf "Examples") | [<img src="https://avatars1.githubusercontent.com/u/2762082?v=4" width="100px;"/><br /><sub>Travis Arnold</sub>](http://travisrayarnold.com)<br /> | [<img src="https://avatars2.githubusercontent.com/u/244704?v=4" width="100px;"/><br /><sub>Jeremy Gayed</sub>](http://www.jeremygayed.com)<br />[💡](#example-tizmagik "Examples") | [<img src="https://avatars3.githubusercontent.com/u/6270048?v=4" width="100px;"/><br /><sub>Haroen Viaene</sub>](https://haroen.me)<br />[💡](#example-Haroenv "Examples") | [<img src="https://avatars2.githubusercontent.com/u/15073300?v=4" width="100px;"/><br /><sub>monssef</sub>](https://github.com/rezof)<br />[💡](#example-rezof "Examples") | [<img src="https://avatars2.githubusercontent.com/u/5382443?v=4" width="100px;"/><br /><sub>Federico Zivolo</sub>](https://fezvrasta.github.io)<br />[📖](https://github.com/kentcdodds/react-completely/commits?author=FezVrasta "Documentation") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/react-completely.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/react-completely
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/react-completely.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/react-completely
[version-badge]: https://img.shields.io/npm/v/react-completely.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-completely
[downloads-badge]: https://img.shields.io/npm/dm/react-completely.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/react-completely
[license-badge]: https://img.shields.io/npm/l/react-completely.svg?style=flat-square
[license]: https://github.com/kentcdodds/react-completely/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/react-completely/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/react-completely.svg?style=social
[github-watch]: https://github.com/kentcdodds/react-completely/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/react-completely.svg?style=social
[github-star]: https://github.com/kentcdodds/react-completely/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20react-completely!%20https://github.com/kentcdodds/react-completely%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/react-completely.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[ryan]: https://github.com/ryanflorence
[compound-components-talk]: https://www.youtube.com/watch?v=hEGg-3pIHlE
[react-autocomplete]: https://www.npmjs.com/package/react-autocomplete
[jquery-complete]: https://jqueryui.com/autocomplete/
