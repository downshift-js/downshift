# Migration from v7 to v8

Downshift v8 receives a list of breaking changes, which are necessary to improve
both the user and the developer experience. The changes are only affecting the
hooks and are detailed below.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [useSelect](#useselect)
- [useCombobox](#usecombobox)
  - [Click](#click)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## useSelect

## useCombobox

### Click

[ARIA 1.2](combobox-aria-example) recommends to toggle the menu open state at
input click. Previously, in v7, the menu was opened on receiving focus, from
both mouse and keyboard. Starting with v8, input focus will not trigger any
state change anymore. Only the input click event will be handled and will
trigger a menu toggle. Consequently:

- getInputProps **will not** return any _Focus_ event handler.
- getInputProps **will** return a _Click_ event handler.
- `useCombobox.stateChangeTypes.InputFocus` has been removed.
- `useCombobox.stateChangeTypes.InputClick` has been added instead.

We recommend having the default toggle on input click behaviour as it's part of
the official ARIA combobox 1.2 spec, but if you wish to override it and not
toggle the menu on click, use the stateReducer:

```js
function stateReducer(state, actionAndChanges) {
  const {changes, type} = actionAndChanges
  switch (type) {
    case useCombobox.stateChangeTypes.InputClick:
      return {
        ...changes,
        isOpen: state.isOpen, // do not toggle the menu when input is clicked.
      }
    default:
      return changes
  }
}
```

If you want to return to the v7 behaviour and open the menu on focus, keep the
reducer above so you remove the toggle behaviour, and call the _openMenu_
imperative function, returned by useCombobox, in a _onFocus_ handler passed to
_getInputProps_:

```js
<input
  {...getInputProps({
    onFocus() {
      openMenu()
    },
  })}
/>
```

Consider to use the default 1.2 ARIA behaviour provided by default in order to
align your widget to the accessibility official spec. This behaviour consistency
improves the user experience, since all comboboxes should behave the same and
there won't be need for any additional guess work done by your users.

[combobox-aria-example]:
  https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-list.html
