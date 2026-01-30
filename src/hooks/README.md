# Downshift Hooks

A set of hooks to build simple, flexible, WAI-ARIA compliant React dropdown
components. Developed as a follow up on [this issue][hooks-issue] about using
hooks in our API.

## Migration to v7

`useSelect` and `useCombobox` received some changes related to their API and how
they works in version 7, as a conequence of adapting both hooks to the ARIA 1.2
combobox patterns. If you were using _useSelect_ and/or _useCombobox_ previous
to 7.0.0, check the [migration guide][migration-guide] and update if necessary.

## Hooks

Check out one of the hooks below to use in your application and create fully
accessible widgets without any constraint about the UI library used.

### useSelect

For a custom `select` dropdown check out [useSelect][select-readme].

### useCombobox

For a `combobox/autocomplete` input check out [useCombobox][combobox-readme].

### useTagGroup

For a `tag group` that could also be used to build a multiple selection `select`
or a `combobox` with tags, check out [useMultipleSelection][tag-group-readme].

## Downshift Hooks API talk

[Silviu](https://silviuaavram.com/) delivered a talk about using the Downshift
hooks at the [axe-con][axe-con] 2021 conference. The talk, which is also
[recorded][axe-con-recording], illustrates how to build an accessible select,
combobox, and support multiple selection using Downshift hooks and custom
components from [ChakraUI][chakra-ui]. It offers a brief crash course to:

- build a custom Select.
- build a custom Combobox.
- enhance the Select and Combobox with multiple selection.
- use custom features like control props, the state reducer and action props.

## Roadmap and contributions

Next steps:

- iterate on `useSelect`, `useCombobox`, `useMultipleSelection` to improve them.
- remove the `Downshift` component once the hooks are mature.

[hooks-issue]: https://github.com/downshift-js/downshift/issues/683
[select-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect
[combobox-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useCombobox
[tag-group-readme]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/useTagGroup
[migration-guide]:
  https://github.com/downshift-js/downshift/tree/master/src/hooks/MIGRATION_V7.md
[axe-con]: https://www.deque.com/axe-con/
[axe-con-recording]:
  https://www.youtube.com/watch?v=iDEETM9Pa4Q&ab_channel=DequeSystems
[chakra-ui]: https://chakra-ui.com/

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
