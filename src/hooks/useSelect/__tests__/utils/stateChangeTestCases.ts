import {act} from '@testing-library/react'
import {
  clickOnItemAtIndex,
  clickOnToggleButton,
  items,
  keyDownOnToggleButton,
  mouseLeaveItemAtIndex,
  mouseMoveItemAtIndex,
  tab,
} from '../../../testUtils'
import * as stateChangeTypes from '../../stateChangeTypes'

export const stateChangeTestCases = [
  {
    step: keyDownOnToggleButton,
    arg: '{Enter}',
    state: {
      isOpen: true,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Enter}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonKeyDownEnter,
  },
  {
    step: keyDownOnToggleButton,
    arg: ' ',
    state: {
      isOpen: true,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Escape}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonKeyDownEscape,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{ArrowDown}',
    state: {
      isOpen: true,
      highlightedIndex: 0,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Enter}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[0],
    },
    type: stateChangeTypes.ToggleButtonKeyDownEnter,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{End}',
    state: {
      isOpen: true,
      highlightedIndex: items.length - 1,
      inputValue: '',
      selectedItem: items[0],
    },
    type: stateChangeTypes.ToggleButtonKeyDownEnd,
  },
  {
    step: keyDownOnToggleButton,
    arg: ' ',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonKeyDownSpaceButton,
  },
  {
    step: clickOnToggleButton,
    state: {
      isOpen: true,
      highlightedIndex: items.length - 1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{PageUp}',
    state: {
      isOpen: true,
      highlightedIndex: items.length - 11,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonKeyDownPageUp,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{PageDown}',
    state: {
      isOpen: true,
      highlightedIndex: items.length - 1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonKeyDownPageDown,
  },
  {
    step: mouseMoveItemAtIndex,
    arg: items.length - 2,
    state: {
      isOpen: true,
      highlightedIndex: items.length - 2,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ItemMouseMove,
  },
  {
    step: mouseLeaveItemAtIndex,
    arg: items.length - 2,
    state: {
      isOpen: true,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.MenuMouseLeave,
  },
  {
    step: mouseMoveItemAtIndex,
    arg: 2,
    state: {
      isOpen: true,
      highlightedIndex: 2,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ItemMouseMove,
  },
  {
    step: clickOnItemAtIndex,
    arg: 2,
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[2],
    },
    type: stateChangeTypes.ItemClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Alt>}{ArrowDown}{/Alt}',
    state: {
      isOpen: true,
      highlightedIndex: 2,
      inputValue: '',
      selectedItem: items[2],
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Alt>}{ArrowDown}{/Alt}',
    state: {
      isOpen: true,
      highlightedIndex: 3,
      inputValue: '',
      selectedItem: items[2],
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Alt>}{ArrowUp}{/Alt}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[3],
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
  },
  {
    step: keyDownOnToggleButton,
    arg: 'c',
    state: {
      isOpen: true,
      highlightedIndex: 5,
      inputValue: 'c',
      selectedItem: items[3],
    },
    type: stateChangeTypes.ToggleButtonKeyDownCharacter,
  },
  {
    step: () =>
      new Promise<void>(resolve => {
        act(() => jest.runAllTimers())
        resolve()
      }),
    state: {
      isOpen: true,
      highlightedIndex: 5,
      inputValue: '',
      selectedItem: items[3],
    },
    type: stateChangeTypes.FunctionSetInputValue,
  },
  {
    step: tab,
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[5],
    },
    type: stateChangeTypes.ToggleButtonBlur,
  },
]
