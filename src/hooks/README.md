<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Downshift Hooks](#downshift-hooks)
  - [Hooks](#hooks)
    - [useSelect](#useselect)
  - [Roadmap and contributions](#roadmap-and-contributions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Downshift Hooks

A set of hooks to build simple, flexible, WAI-ARIA compliant React dropdown components.
Developed as a follow up on [this issue][hooks-issue] about using hooks in our API.

## Hooks

### useSelect

For a `<select>` custom dropdown [click here][select-readme].

## Roadmap and contributions

Next steps:

- complete testing for the `useSelect` hook and polishing API.
- create types (TS and Flow) for it or re-write it directly in Typescript.
- create `useAutocomplete` hook (the old Downshift default component) for the combobox design pattern.
- create `multiple` versions for `useSelect` and `useAutocomplete`.

[hooks-issue]: https://github.com/downshift-js/downshift/issues/683
[select-readme]: https://github.com/silviuavram/downshift/blob/master/src/hooks/useSelect
