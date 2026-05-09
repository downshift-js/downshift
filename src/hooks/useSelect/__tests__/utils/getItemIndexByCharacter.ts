import {items} from '../../../testUtils'

/**
 * Return the index of the item that starts with the character.
 * @param character The start of the item string.
 * @param startIndex The index to start searching.
 * @returns The index of the item.
 */
export function getItemIndexByCharacter(character: string, startIndex = 0) {
  return (
    items
      .slice(startIndex)
      .findIndex(item =>
        item.toLowerCase().startsWith(character.toLowerCase()),
      ) + startIndex
  )
}
