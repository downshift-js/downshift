# Downshift Hooks

A set of hooks to build simple, flexible, WAI-ARIA compliant React dropdown
components. Developed as a follow up on [this issue][hooks-issue] about using
hooks in our API.

## Hooks

### useSelect

For a `<select>` custom dropdown [click here][select-readme].

### useCombobox

For a `combobox autocomplete` dropdown [click here][select-readme].

## Roadmap and contributions

Next steps:

- create/fix types (TS and Flow) for `useSelect` and `useCombobox`.
- create `useMultipleSelection` that augments `useSelect` and `useCombobox` and
  provide integrated multiple selection logic.

[hooks-issue]: https://github.com/downshift-js/downshift/issues/683
[select-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect
[combobox-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useCombobox

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
