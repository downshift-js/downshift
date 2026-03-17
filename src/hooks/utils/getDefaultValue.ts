/**
 * Returns the default value based on the defaultProp and defaultStateValue.
 *
 * @param defaultProp The default prop value.
 * @param defaultStateValue The default state value.
 * @returns The resolved default value.
 */
export function getDefaultValue<T>(
  defaultProp: T | undefined,
  defaultStateValue: T,
): T {
  return defaultProp === undefined ? defaultStateValue : defaultProp
}
