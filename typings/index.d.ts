/// <reference path="./index.legacy.d.ts" />

/* ---------------- Interfaces ---------------- */

export interface DownshiftState<Item> extends globalThis.DownshiftState<Item> {}
export interface DownshiftProps<Item> extends globalThis.DownshiftProps<Item> {}
export interface Environment extends globalThis.Environment {}
export interface A11yStatusMessageOptions<Item> extends globalThis.A11yStatusMessageOptions<Item> {}
export interface StateChangeOptions<Item> extends globalThis.StateChangeOptions<Item> {}
export interface GetRootPropsOptions extends globalThis.GetRootPropsOptions {}
export interface GetRootPropsReturnValue extends globalThis.GetRootPropsReturnValue {}
export interface GetInputPropsOptions extends globalThis.GetInputPropsOptions {}
export interface GetInputPropsReturnValue extends globalThis.GetInputPropsReturnValue {}
export interface GetLabelPropsOptions extends globalThis.GetLabelPropsOptions {}
export interface GetLabelPropsReturnValue extends globalThis.GetLabelPropsReturnValue {}
export interface GetToggleButtonPropsOptions extends globalThis.GetToggleButtonPropsOptions {}
export interface GetMenuPropsOptions extends globalThis.GetMenuPropsOptions {}
export interface GetMenuPropsReturnValue extends globalThis.GetMenuPropsReturnValue {}
export interface GetPropsCommonOptions extends globalThis.GetPropsCommonOptions {}
export interface GetPropsWithRefKey extends globalThis.GetPropsWithRefKey {}
export interface GetItemPropsOptions<Item> extends globalThis.GetItemPropsOptions<Item> {}
export interface GetItemPropsReturnValue extends globalThis.GetItemPropsReturnValue {}
export interface PropGetters<Item> extends globalThis.PropGetters<Item> {}
export interface Actions<Item> extends globalThis.Actions<Item> {}

/* ---------------- Hooks / Class / Functions ---------------- */

export const Downshift: typeof globalThis.Downshift;
export default Downshift;

export const resetIdCounter: typeof globalThis.resetIdCounter;
export const useSelect: typeof globalThis.useSelect;
export const useCombobox: typeof globalThis.useCombobox;
export const useMultipleSelection: typeof globalThis.useMultipleSelection;

/* ---------------- Enums (value + type) ---------------- */

export const StateChangeTypes: typeof globalThis.StateChangeTypes;
export type StateChangeTypes = globalThis.StateChangeTypes;

export const UseSelectStateChangeTypes: typeof globalThis.UseSelectStateChangeTypes;
export type UseSelectStateChangeTypes = globalThis.UseSelectStateChangeTypes;

export const UseComboboxStateChangeTypes: typeof globalThis.UseComboboxStateChangeTypes;
export type UseComboboxStateChangeTypes = globalThis.UseComboboxStateChangeTypes;

export const UseMultipleSelectionStateChangeTypes: typeof globalThis.UseMultipleSelectionStateChangeTypes;
export type UseMultipleSelectionStateChangeTypes = globalThis.UseMultipleSelectionStateChangeTypes;

/* ---------------- useSelect interfaces ---------------- */

export interface UseSelectState<Item> extends globalThis.UseSelectState<Item> {}
export interface UseSelectProps<Item> extends globalThis.UseSelectProps<Item> {}
export interface UseSelectStateChangeOptions<Item> extends globalThis.UseSelectStateChangeOptions<Item> {}
export interface UseSelectDispatchAction<Item> extends globalThis.UseSelectDispatchAction<Item> {}
export interface UseSelectStateChange<Item> extends globalThis.UseSelectStateChange<Item> {}
export interface UseSelectSelectedItemChange<Item> extends globalThis.UseSelectSelectedItemChange<Item> {}
export interface UseSelectHighlightedIndexChange<Item> extends globalThis.UseSelectHighlightedIndexChange<Item> {}
export interface UseSelectIsOpenChange<Item> extends globalThis.UseSelectIsOpenChange<Item> {}
export interface UseSelectGetMenuPropsOptions extends globalThis.UseSelectGetMenuPropsOptions {}
export interface UseSelectGetMenuReturnValue extends globalThis.UseSelectGetMenuReturnValue {}
export interface UseSelectGetToggleButtonPropsOptions extends globalThis.UseSelectGetToggleButtonPropsOptions {}
export interface UseSelectGetToggleButtonReturnValue extends globalThis.UseSelectGetToggleButtonReturnValue {}
export interface UseSelectGetLabelPropsOptions extends globalThis.UseSelectGetLabelPropsOptions {}
export interface UseSelectGetLabelPropsReturnValue extends globalThis.UseSelectGetLabelPropsReturnValue {}
export interface UseSelectGetItemPropsOptions<Item> extends globalThis.UseSelectGetItemPropsOptions<Item> {}
export interface UseSelectGetItemPropsReturnValue extends globalThis.UseSelectGetItemPropsReturnValue {}
export interface UseSelectPropGetters<Item> extends globalThis.UseSelectPropGetters<Item> {}
export interface UseSelectActions<Item> extends globalThis.UseSelectActions<Item> {}
export interface UseSelectReturnValue<Item> extends globalThis.UseSelectReturnValue<Item> {}
export interface UseSelectInterface extends globalThis.UseSelectInterface {}

/* ---------------- useCombobox interfaces ---------------- */

export interface UseComboboxState<Item> extends globalThis.UseComboboxState<Item> {}
export interface UseComboboxProps<Item> extends globalThis.UseComboboxProps<Item> {}
export interface UseComboboxStateChangeOptions<Item> extends globalThis.UseComboboxStateChangeOptions<Item> {}
export interface UseComboboxDispatchAction<Item> extends globalThis.UseComboboxDispatchAction<Item> {}
export interface UseComboboxStateChange<Item> extends globalThis.UseComboboxStateChange<Item> {}
export interface UseComboboxSelectedItemChange<Item> extends globalThis.UseComboboxSelectedItemChange<Item> {}
export interface UseComboboxHighlightedIndexChange<Item> extends globalThis.UseComboboxHighlightedIndexChange<Item> {}
export interface UseComboboxIsOpenChange<Item> extends globalThis.UseComboboxIsOpenChange<Item> {}
export interface UseComboboxInputValueChange<Item> extends globalThis.UseComboboxInputValueChange<Item> {}
export interface UseComboboxGetMenuPropsOptions extends globalThis.UseComboboxGetMenuPropsOptions {}
export interface UseComboboxGetMenuPropsReturnValue extends globalThis.UseComboboxGetMenuPropsReturnValue {}
export interface UseComboboxGetToggleButtonPropsOptions extends globalThis.UseComboboxGetToggleButtonPropsOptions {}
export interface UseComboboxGetToggleButtonReturnValue extends globalThis.UseComboboxGetToggleButtonReturnValue {}
export interface UseComboboxGetItemPropsOptions<Item> extends globalThis.UseComboboxGetItemPropsOptions<Item> {}
export interface UseComboboxGetItemPropsReturnValue extends globalThis.UseComboboxGetItemPropsReturnValue {}
export interface UseComboboxGetInputPropsOptions extends globalThis.UseComboboxGetInputPropsOptions {}
export interface UseComboboxGetInputPropsReturnValue extends globalThis.UseComboboxGetInputPropsReturnValue {}
export interface UseComboboxPropGetters<Item> extends globalThis.UseComboboxPropGetters<Item> {}
export interface UseComboboxActions<Item> extends globalThis.UseComboboxActions<Item> {}
export interface UseComboboxReturnValue<Item> extends globalThis.UseComboboxReturnValue<Item> {}
export interface UseComboboxInterface extends globalThis.UseComboboxInterface {}

/* ---------------- useMultipleSelection interfaces ---------------- */

export interface UseMultipleSelectionState<Item> extends globalThis.UseMultipleSelectionState<Item> {}
export interface UseMultipleSelectionProps<Item> extends globalThis.UseMultipleSelectionProps<Item> {}
export interface UseMultipleSelectionStateChangeOptions<Item> extends globalThis.UseMultipleSelectionStateChangeOptions<Item> {}
export interface UseMultipleSelectionDispatchAction<Item> extends globalThis.UseMultipleSelectionDispatchAction<Item> {}
export interface UseMultipleSelectionStateChange<Item> extends globalThis.UseMultipleSelectionStateChange<Item> {}
export interface UseMultipleSelectionActiveIndexChange<Item> extends globalThis.UseMultipleSelectionActiveIndexChange<Item> {}
export interface UseMultipleSelectionSelectedItemsChange<Item> extends globalThis.UseMultipleSelectionSelectedItemsChange<Item> {}
export interface A11yRemovalMessage<Item> extends globalThis.A11yRemovalMessage<Item> {}
export interface UseMultipleSelectionGetSelectedItemPropsOptions<Item> extends globalThis.UseMultipleSelectionGetSelectedItemPropsOptions<Item> {}
export interface UseMultipleSelectionGetSelectedItemReturnValue extends globalThis.UseMultipleSelectionGetSelectedItemReturnValue {}
export interface UseMultipleSelectionGetDropdownPropsOptions extends globalThis.UseMultipleSelectionGetDropdownPropsOptions {}
export interface UseMultipleSelectionGetDropdownReturnValue extends globalThis.UseMultipleSelectionGetDropdownReturnValue {}
export interface UseMultipleSelectionPropGetters<Item> extends globalThis.UseMultipleSelectionPropGetters<Item> {}
export interface UseMultipleSelectionActions<Item> extends globalThis.UseMultipleSelectionActions<Item> {}
export interface UseMultipleSelectionReturnValue<Item> extends globalThis.UseMultipleSelectionReturnValue<Item> {}
export interface UseMultipleSelectionInterface extends globalThis.UseMultipleSelectionInterface {}

/* ------- Re-export generated TS declarations ------- */

export {
  UseTagGroupState,
  UseTagGroupProps,
  UseTagGroupReturnValue,
  UseTagGroupInterface,
  GetTagGroupProps,
  GetTagGroupPropsOptions,
  GetTagGroupPropsReturnValue,
  GetTagProps,
  GetTagPropsOptions,
  GetTagPropsReturnValue,
  GetTagRemoveProps,
  GetTagRemovePropsOptions,
  GetTagRemovePropsReturnValue,
  UseTagGroupStateChangeTypes,
} from '../dist/src/hooks/useTagGroup/index.types'

export const useTagGroup: UseTagGroupInterface;
