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

export function getExampleLabelClassName(selectedItem?: string | null) {
  if (!selectedItem) {
    return 'example-label'
  }

  return `example-label example-color-${selectedItem.toLowerCase()}`
}
