import { normalizeArrowKey } from "../normalizeArrowKey";

test('normalizeArrowKey should return the correct key for arrow keys in IE/Edge', () => {
  const event = {
    key: 'Left',
    keyCode: 37
  } as KeyboardEvent;
  expect(normalizeArrowKey(event)).toBe('ArrowLeft');
});

test('normalizeArrowKey should return the original key for non-arrow keys', () => {
  const event = {
    key: 'Enter',
    keyCode: 13
  } as KeyboardEvent;
  expect(normalizeArrowKey(event)).toBe('Enter');
});

test('normalizeArrowKey should return the original key for arrow keys in modern browsers', () => {
  const event = {
    key: 'ArrowUp',
    keyCode: 38
  } as KeyboardEvent;
  expect(normalizeArrowKey(event)).toBe('ArrowUp');
});