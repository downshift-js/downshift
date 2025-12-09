import * as React from 'react'

let idCounter = 0

/**
 * This generates a unique ID for an instance of Downshift
 * @return {string} the unique ID
 */
export function generateId(): string {
  return String(idCounter++)
}

/**
 * This is only used in tests
 * @param {number} num the number to set the idCounter to
 */
export function setIdCounter(num: number): void {
  idCounter = num
}

/**
 * Resets idCounter to 0. Used for SSR.
 */
export function resetIdCounter() {
  // istanbul ignore next
  if ('useId' in React) {
    console.warn(
      `It is not necessary to call resetIdCounter when using React 18+`,
    )

    return
  }

  idCounter = 0
}
