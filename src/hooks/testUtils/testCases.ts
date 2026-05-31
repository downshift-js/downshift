// format is: [initialIsOpen, defaultIsOpen, props.isOpen]
export const initialFocusAndOpenTestCases = [
  [undefined, undefined, true],
  [true, true, true],
  [true, false, true],
  [false, true, true],
  [false, false, true],
  [true, undefined, undefined],
  [true, false, undefined],
  [true, true, undefined],
  [undefined, true, undefined],
]

// format is: [initialIsOpen, defaultIsOpen, props.isOpen]
export const initialNoFocusOrOpenTestCases = [
  [undefined, undefined, undefined],
  [undefined, undefined, false],
  [true, true, false],
  [true, false, false],
  [false, true, false],
  [false, false, false],
  [false, undefined, undefined],
  [false, false, undefined],
  [false, true, undefined],
  [undefined, false, undefined],
]
