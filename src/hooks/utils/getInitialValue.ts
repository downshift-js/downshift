export function getInitialValue<T>(
  value: T | undefined,
  initialValue: T | undefined,
  defaultValue: T | undefined,
  defaultStateValue: T,
): T {
  return value ?? initialValue ?? defaultValue ?? defaultStateValue
}
