<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [downshift-hooks](#downshift-hooks)
  - [The problem](#the-problem)
  - [This solution](#this-solution)
  - [Installation](#installation)
  - [Hooks](#hooks)
    - [useSelect()](#useselect)
  - [Roadmap and contributions](#roadmap-and-contributions)
  - [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# downshift-hooks

A set of hooks to build simple, flexible, WAI-ARIA compliant React dropdown components.

[![Build Status](https://travis-ci.org/silviuavram/downshift-hooks.svg?branch=master)](https://travis-ci.org/silviuavram/downshift-hooks)

## The problem

You need an autocomplete/dropdown/select experience in your application and you want it to be accessible. You also want it to be simple and flexible to account for your use cases.

## This solution

This set of hooks is inspired by [downshift][downshift] and aims to provide functionality and accessibility to dropdown and combobox components.

At the moment, the first hook developed is `useSelect()` and it means to implement the [select dropdown][select-dropdown] ARIA design pattern. Another future 3 new hooks should be implemented: `useAutocomplete()`, `useMultipleSelect()` and `useMultipleAutocomplete()`. Having one hook for each different widget allows the user to write little additional stateful logic (hopefully none) in order to make them accessible and functional. That being said, the hooks still follow the vanilla `Downshift` principle of being completely customisable.

The API will be as similar as possible for each of these hooks and will follow the one already present in Downshift. Differences will appear only when the design pattern requires for them to do so.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should be installed as one of your project's `dependencies`:

```
npm install --save downshift-hooks
```

## Hooks

### useSelect()

For a select dropdown [click here][select-readme].

## Roadmap and contributions

Next steps:

- complete testing for the `useSelect()` hook.
- create `useAutocomplete()` hook (the old Downshift default component) for the combobox design pattern.
- create `multiple` versions for `useSelect()` and `useAutocomplete()`.

Share your opinion about having separate hooks for each component case. Help out with ideas, feature prioritisation, code quality, documentation and anything else by creating Issues in this repositiory. Much appreciated!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[downshift]: https://github.com/downshift-js/downshift
[select-dropdown]: https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
[select-readme]: https://github.com/silviuavram/downshift-hooks/blob/master/src/hooks/useSelect/README.md
