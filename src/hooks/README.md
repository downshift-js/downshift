# Downshift Hooks

A set of hooks to build simple, flexible, WAI-ARIA compliant React dropdown
components. Developed as a follow up on [this issue][hooks-issue] about using
hooks in our API.

## Migration to v7

`useSelect` and `useCombobox` received some changes related to their API and how
they works in version 7, as a conequence of adapting both hooks to the ARIA 1.2
combobox patterns. If you were using _useSelect_ and/or _useCombobox_ previous
to 7.0.0, check the migration guides and update if necessary.

- [useSelect migration guide][select-migration]
- [useCombobox migration guide][combobox-migration]

## Hooks

Check out one of the hooks below to use in your application and create fully
accessible widgets without any constraint about the UI library used.

### useSelect

For a custom `select` dropdown check out [useSelect][select-readme].

### useCombobox

For a `combobox/autocomplete` input check out [useCombobox][combobox-readme].

### useMultipleSelection

For a `multiple selection` with either a `select` or a `combobox` check out
[useMultipleSelection][multiple-selection-readme].

## Roadmap and contributions

Next steps:

- iterate on `useSelect`, `useCombobox`, `useMultipleSelection` to make them
  better and more robust.
- plan the development of hooks for other widgets that require a11y, for
  instance carousels, split buttons, trees, etc.

[hooks-issue]: https://github.com/downshift-js/downshift/issues/683
[select-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect
[combobox-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useCombobox
[multiple-selection-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useMultipleSelection
[select-migration]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect/MIGRATION_V7.md
[combobox-migration]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useCombobox/MIGRATION_V7.md
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
