import {type CSSProperties} from 'react'

export const colors = [
  'Black',
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Pink',
  'Orchid',
  'Aqua',
  'Lime',
  'Gray',
  'Brown',
  'Teal',
  'Skyblue',
]

export const menuStyles: CSSProperties = {
  listStyle: 'none',
  width: '100%',
  padding: '0',
  margin: '4px 0 0 0',
  maxHeight: 120,
  overflowY: 'scroll',
}

export const containerStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: 'fit-content',
  justifyContent: 'center',
  marginTop: 100,
  alignSelf: 'center',
}

export const selectedItemsContainerSyles: CSSProperties = {
  display: 'inline-flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap',
  padding: '6px',
}

export const selectedItemStyles: CSSProperties = {
  backgroundColor: 'green',
  padding: '0 6px',
  margin: '0 2px',
  borderRadius: '10px',
}

export const removeTagStyles: CSSProperties = {
  padding: '4px',
  cursor: 'pointer',
}
