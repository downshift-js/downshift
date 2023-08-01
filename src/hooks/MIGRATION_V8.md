# Migration from v7 to v8

Downshift v8 receives a list of breaking changes, which are necessary to improve
both the user and the developer experience. The changes are only affecting the
hooks and are detailed below.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [isItemDisabled](#isitemdisabled)
- [useCombobox input click](#usecombobox-input-click)
- [Getter props return value types](#getter-props-return-value-types)
- [environment propTypes](#environment-proptypes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## isItemDisabled

Both `useCombobox` and `useSelect` now support the `isItemDisabled` function.
This new API is used to mark menu items as disabled, and as such remove the from
the navigation and prevent them from being selected. The old API required
passing the `disabled` prop to the `getItemProps` function. This old API has
been removed and you will receive a console warning if you are trying to use the
`disabled` prop in getItemProps.

Example of API migration:

Old:

```jsx
const items = [{value: 'item1'}, {value: 'item2'}]

const {getInputProps, ...rest} = useCombobox({items})

return (
  // ... rest
  <li {...getItemProps({item, disabled: item.value === 'item2'})}>
)
```

New:

```jsx
const items = [{value: 'item1'}, {value: 'item2'}]

const {getInputProps, ...rest} = useCombobox({items, isItemDisabled(item, _index) { return item.value === 'item2' }})

return (
  // ... rest
  <li {...getItemProps({item})}>
)
```

The API for Downshift remains unchange.

Related PR: https://github.com/downshift-js/downshift/pull/1510

## useCombobox input click

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

Related PR: https://github.com/downshift-js/downshift/pull/1440

## Getter props return value types

Previously, the return value from the getter props returned by both Downshift
and the hooks was `any`. In v8 we improved the types in order to reflect what is
actually returned: the default values return by the getter prop function and
whatever else the user passes as arguments. The type changes are done in
[this PR](https://github.com/downshift-js/downshift/pull/1482) and the
[8.0.1 PR](https://github.com/downshift-js/downshift/pull/1524), make sure you
adapt your TS code, if applicable.

Also, in the `Downshift` component, the return values for some getter prop
values have changed from `null` to `undefined`, since that is what HTML elements
expect (value or undefined). These values are also reflected in the TS types.

- getRootProps: 'aria-owns': isOpen ? this.menuId : ~~null~~undefined,
- getInputProps:
  - 'aria-controls': isOpen ? this.menuId : ~~null~~undefined
  - 'aria-activedescendant': isOpen && typeof highlightedIndex === 'number' &&
    highlightedIndex >= 0 ? this.getItemId(highlightedIndex) : ~~null~~undefined
- getMenuProps: props && props['aria-label'] ? ~~null~~undefined : this.labelId,

Related PR: https://github.com/downshift-js/downshift/pull/1482

## environment propTypes

The `environment` prop is useful when you are using downshift in a context
different than regular DOM. Its TS type has been updated to contain `Node` and
the propTypes have also been updated to reflect the properties which are
required by downshift from `environment`.

Related PR: https://github.com/downshift-js/downshift/pull/1463

[combobox-aria-example]:
  https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-list.html
