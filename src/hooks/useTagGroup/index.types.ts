import {Overwrite} from '../../../typings'
import {Action, State} from '../../utils-ts'

export interface UseTagGroupState<Item> extends State {
  activeIndex: number
  items: Item[]
}

export interface UseTagGroupProps<Item> extends Partial<
  UseTagGroupState<Item>
> {
  initialActiveIndex?: number
  initialItems?: Item[]
  tagGroupId?: string
  getTagId?: (index: number) => string
  id?: string
  stateReducer?(
    state: UseTagGroupState<Item>,
    actionAndChanges: Action<UseTagGroupStateChangeTypes> & {
      changes: Partial<UseTagGroupState<Item>>
    },
  ): Partial<UseTagGroupState<Item>>
  environment?: Environment
  removeElementDescription?: string
}

export type UseTagGroupMergedProps<Item> = Required<
  Pick<UseTagGroupProps<Item>, 'stateReducer' | 'removeElementDescription'>
> & UseTagGroupProps<Item>

export interface UseTagGroupInterface {
  <Item>(props?: UseTagGroupProps<Item>): UseTagGroupReturnValue<Item>
  stateChangeTypes: {
    TagClick: UseTagGroupStateChangeTypes.TagClick
    TagGroupKeyDownArrowLeft: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft
    TagGroupKeyDownArrowRight: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight
    TagGroupKeyDownBackspace: UseTagGroupStateChangeTypes.TagGroupKeyDownBackspace
    TagGroupKeyDownDelete: UseTagGroupStateChangeTypes.TagGroupKeyDownDelete
    TagRemoveClick: UseTagGroupStateChangeTypes.TagRemoveClick
    FunctionAddItem: UseTagGroupStateChangeTypes.FunctionAddItem
  }
}

export interface UseTagGroupReturnValue<Item> {
  activeIndex: number
  addItem: (item: Item, index?: number) => void
  getTagGroupProps: GetTagGroupProps
  getTagProps: GetTagProps
  getTagRemoveProps: GetTagRemoveProps
  items: Item[]
}

export interface GetTagPropsOptions extends React.HTMLProps<HTMLElement> {
  index?: number
  refKey?: string
  ref?: React.MutableRefObject<HTMLElement>
}

export interface GetTagPropsReturnValue {
  'aria-describedby': string
  id: string
  role: 'option'
  onPress?: (event: React.BaseSyntheticEvent) => void
  onClick?: React.MouseEventHandler
  tabIndex: 0 | -1
}

export interface GetTagRemovePropsOptions extends React.HTMLProps<HTMLElement> {
  index?: number
}

export interface GetTagRemovePropsReturnValue {
  id: string
  'aria-labelledby': string
  onPress?: (event: React.BaseSyntheticEvent) => void
  onClick?: React.MouseEventHandler
  tabIndex: -1
}

export interface GetTagGroupPropsOptions extends React.HTMLProps<HTMLElement> {
  refKey?: string
  ref?: React.MutableRefObject<HTMLElement>
}

export interface GetTagGroupPropsReturnValue {
  id: string
  role: 'listbox'
  'aria-live': 'polite'
  'aria-atomic': 'false'
  'aria-relevant': 'additions'
  onKeyDown: React.KeyboardEventHandler
}

export type GetTagGroupProps = <Options>(
  options?: GetTagGroupPropsOptions & Options,
) => Overwrite<GetTagGroupPropsReturnValue, Options>

export type GetTagProps = <Options>(
  options?: GetTagPropsOptions & Options,
) => Overwrite<GetTagPropsReturnValue, Options>

export type GetTagRemoveProps = <Options>(
  options?: GetTagRemovePropsOptions & Options,
) => Overwrite<GetTagRemovePropsReturnValue, Options>

export enum UseTagGroupStateChangeTypes {
  TagClick = '__tag_click__',
  TagGroupKeyDownArrowLeft = '__taggroup_keydown_arrowleft__',
  TagGroupKeyDownArrowRight = '__taggroup_keydown_arrowright__',
  TagGroupKeyDownBackspace = '__taggroup_keydown_backspace__',
  TagGroupKeyDownDelete = '__taggroup_keydown_delete__',
  TagRemoveClick = '__tagremove_click__',
  FunctionAddItem = '__function_add_item__',
}

export type UseTagGroupReducerAction<Item> =
  | UseTagGroupTagClickReducerAction
  | UseTagGroupTagKeyDownArrowLeftAction
  | UseTagGroupTagKeyDownArrowRightAction
  | UseTagGroupTagKeyDownBackspaceAction
  | UseTagGroupTagKeyDownDeleteAction
  | UseTagGroupTagRemoveClickAction
  | UseTagGroupFunctionAddItem<Item>

export type UseTagGroupTagClickReducerAction = {
  type: UseTagGroupStateChangeTypes.TagClick
  index: number
}

export type UseTagGroupTagKeyDownArrowLeftAction = {
  type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft
}
export type UseTagGroupTagKeyDownArrowRightAction = {
  type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight
}
export type UseTagGroupTagKeyDownBackspaceAction = {
  type: UseTagGroupStateChangeTypes.TagGroupKeyDownBackspace
}
export type UseTagGroupTagKeyDownDeleteAction = {
  type: UseTagGroupStateChangeTypes.TagGroupKeyDownDelete
}
export type UseTagGroupTagRemoveClickAction = {
  type: UseTagGroupStateChangeTypes.TagRemoveClick
  index: number
}
export type UseTagGroupFunctionAddItem<Item> = {
  type: UseTagGroupStateChangeTypes.FunctionAddItem
  item: Item
  index?: number
}

export interface Environment {
  document: Document
}
