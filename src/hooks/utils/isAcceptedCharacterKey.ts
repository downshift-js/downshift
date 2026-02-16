export function isAcceptedCharacterKey(key: string): boolean {
  return /^\S{1}$/.test(key)
}
