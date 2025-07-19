import {Overwrite} from '../../../typings'
import {Action} from './utils.types'

export interface UseTagGroupState<Item> extends Record<string, unknown> {
  activeIndex: number
  items: Item[]
}

export interface UseTagGroupProps<Item>
  extends Partial<UseTagGroupState<Item>> {
  defaultActiveIndex?: number
  defaultItems?: Item[]
  initialActiveIndex?: number
  initialItems?: Item[]
  tagGroupId?: string
  getTagId?: (index: number) => string
  id?: string
  stateReducer(
    state: UseTagGroupState<Item>,
    actionAndChanges: Action<UseTagGroupStateChangeTypes> & {
      changes: Partial<UseTagGroupState<Item>>
    },
  ): Partial<UseTagGroupState<Item>>
  environment?: Environment
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

export interface GetTagPropsReturnValue extends React.HTMLProps<HTMLElement> {
  id: string
  role: string
}

export interface GetTagRemovePropsOptions extends React.HTMLProps<HTMLElement> {
  index?: number
}

export interface GetTagRemovePropsReturnValue
  extends React.HTMLProps<HTMLElement> {
  id: string
  'aria-labelledby': string
}

export type GetTagGroupPropsOptions = React.HTMLProps<HTMLElement>

export interface GetTagGroupPropsReturnValue
  extends React.HTMLProps<HTMLElement> {
  role: string
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
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  document: Document
  Node: typeof window.Node
}
