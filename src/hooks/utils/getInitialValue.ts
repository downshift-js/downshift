/**
 * Returns the initial value for a state variable, based on the following precedence:
 * 1. The controlled value (if it's not undefined)
 * 2. The initialValue (if it's not undefined)
 * 3. The defaultValue (if it's not undefined)
 * 4. The defaultStateValue
 *
 * @param value The controlled value of the state variable.
 * @param initialValue The initial value of the state variable.
 * @param defaultValue The default value of the state variable.
 * @param defaultStateValue The default state value to use if all other values are undefined.
 * @returns The initial value for the state variable.
 */
export function getInitialValue<T>(
  value: T | undefined,
  initialValue: T | undefined,
  defaultValue: T | undefined,
  defaultStateValue: T,
): T {
  if (value !== undefined) {
    return value
  }

  if (initialValue !== undefined) {
    return initialValue
  }

  if (defaultValue !== undefined) {
    return defaultValue
  }

  return defaultStateValue
}
