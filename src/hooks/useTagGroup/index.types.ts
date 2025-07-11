import {Overwrite} from '../../../typings'
import {Action} from './utils.types'

export interface UseTagGroupState<Item> extends Record<string, unknown> {
  activeIndex: number
  items: Item[]
}

export interface UseTagGroupProps<Item> extends Partial<UseTagGroupState<Item>> {
  defaultActiveIndex?: number
  defaultItems?: Item[]
  initialActiveIndex?: number
  initialItems?: Item[]
  groupId?: string
  getItemId?: (index: number) => string
  id?: string
  stateReducer(
    state: UseTagGroupState<Item>,
    actionAndChanges: Action<UseTagGroupStateChangeTypes> & {
      changes: Partial<UseTagGroupState<Item>>
    },
  ): Partial<UseTagGroupState<Item>>
}

export interface UseTagGroupReturnValue<Item> {
  getTagGroupProps: GetTagGroupProps
  getTagProps: GetTagProps
  getTagRemoveProps: GetTagRemoveProps
  items: Item[]
  activeIndex: number
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
}

export type UseTagGroupReducerAction =
  | UseTagGroupTagClickReducerAction
  | UseTagGroupTagGroupKeyDownArrowLeftAction
  | UseTagGroupTagGroupKeyDownArrowRightAction

export type UseTagGroupTagClickReducerAction = {
  type: UseTagGroupStateChangeTypes.TagClick
  index: number
}

export type UseTagGroupTagGroupKeyDownArrowLeftAction = {
  type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft
}
export type UseTagGroupTagGroupKeyDownArrowRightAction = {
  type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight
}
