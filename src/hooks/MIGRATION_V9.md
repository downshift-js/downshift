# Migration from v8 to v9

Downshift v8 receives a list of breaking changes, which are necessary to improve
both the user and the developer experience. The changes are only affecting the
hooks and are detailed below.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [onChange Typescript Improvements](#onchange-typescript-improvements)
- [getA11ySelectionMessage](#geta11yselectionmessage)
- [getA11yRemovalMessage](#geta11yremovalmessage)
- [getA11yStatusMessage](#geta11ystatusmessage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## onChange Typescript Improvements

The handlers below have their types improved to reflect that they will always
get called with their corresponding state prop:

- useCombobox
  - onSelectedItemChange: selectedItem is non optional
  - onIsOpenChange: isOpen is non optional
  - onHighlightedIndexChange: highlightedIndex is non optional

- useSelect
  - onSelectedItemChange: selectedItem is non optional
  - onIsOpenChange: isOpen is non optional
  - onHighlightedIndexChange: highlightedIndex is non optional
  - onInputValueChange: inputValue is non optional

- useMultipleSelection
  - onActiveIndexChange: activeIndex is non optional
  - onSelectedItemsChange: selectedItems is non optional

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## getA11ySelectionMessage

The prop has been removed from useSelect and useCombobox. If you still need an
a11y selection message, use either `getA11yStatusMessage` or your own aria-live
implementation inside a `onStateChange` callback.

## getA11yRemovalMessage

The prop has been removed from useMultipleSelection. If you still need an a11y
removal message, use either `getA11yStatusMessage` or your own aria-live
implementation inside a `onStateChange` callback.

## getA11yStatusMessage

The prop has been also added to useMultipleSelection, but has some changes
reflected in each of the hook's readme.

- there is no default function provided, so you will not get any aria-live
  message anymore if you don't provide the prop directly to the hooks.
- the function is called only with the hook's state, and you should already have
  access to the props, such as items or itemToString. Values such as
  highlightedItem or resultsCount have been removed, so you need to compute them
  yourself if needed.
- `Downshift` is not affected, it has the same `getA11yStatusMessage` as before,
  no changes there at all.

The HTML markup with the ARIA attributes we provide through the getter props
should be enough for screen readers to report:

- results count.
- highlighted item.
- item selection.
- what actions the user can take.

If you need anything more specific as part of an aria-live region, please use
the new version of `getA11yStatusMessage` or your own aria-live implementation.

References:

- [useCombobox docs](https://github.com/downshift-js/downshift/blob/master/src/hooks/useCombobox/README.md#geta11ystatusmessage)
- [useSelect docs](https://github.com/downshift-js/downshift/blob/master/src/hooks/useSelect/README.md#geta11ystatusmessage)
- [useMultipleSelection docs](https://github.com/downshift-js/downshift/blob/master/src/hooks/useMultipleSelection/README.md#geta11ystatusmessage)
