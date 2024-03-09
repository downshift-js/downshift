# Migration from v8 to v9

Downshift v8 receives a list of breaking changes, which are necessary to improve
both the user and the developer experience. The changes are only affecting the
hooks and are detailed below.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [onChange Typescript Improvements](#onchange-typescript-improvements)

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