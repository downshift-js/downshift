import * as React from 'react'
import {dataTestIds} from './fixtures'

type MemoizedItemProps = {
  index: number
  item: string
  getItemProps: (
    options: Record<string, unknown>,
  ) => React.HTMLAttributes<HTMLLIElement>
  stringItem: string
  [key: string]: unknown
}

export const MemoizedItem = React.memo(function Item({
  index,
  item,
  getItemProps,
  stringItem,
  ...rest
}: MemoizedItemProps) {
  return (
    <li
      data-testid={dataTestIds.item(index)}
      key={`${stringItem}${index}`}
      {...getItemProps({item, index, ...rest})}
    >
      {stringItem}
    </li>
  )
})
