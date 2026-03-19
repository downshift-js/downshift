/**
 * Normalizes the 'key' property of a KeyboardEvent in IE/Edge
 * @param {Object} event a keyboardEvent object
 * @return {String} keyboard key
 */
export function normalizeArrowKey(event: KeyboardEvent): string {
  const {key, keyCode} = event
  /* istanbul ignore next (ie) */
  if (keyCode >= 37 && keyCode <= 40 && !key.startsWith('Arrow')) {
    return `Arrow${key}`
  }
  return key
}
