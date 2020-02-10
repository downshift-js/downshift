import {getA11yStatusMessage} from '../utils'

const tests = [
  {
    input: {
      isOpen: false,
      selectedItem: null,
    },
    output: '',
  },
  {
    input: {
      isOpen: true,
      resultCount: 0,
    },
    output: 'No results are available.',
  },
  {
    input: {
      isOpen: true,
      resultCount: 10,
    },
    output:
      '10 results are available, use up and down arrow keys to navigate. Press Enter key to select.',
  },
  {
    input: {
      isOpen: true,
      resultCount: 9,
      previousResultCount: 12,
    },
    output:
      '9 results are available, use up and down arrow keys to navigate. Press Enter key to select.',
  },
  {
    input: {
      isOpen: true,
      resultCount: 8,
      previousResultCount: 20,
      highlightedItem: 'Oranges',
    },
    output:
      '8 results are available, use up and down arrow keys to navigate. Press Enter key to select.',
  },
  {
    input: {
      isOpen: true,
      resultCount: 1,
    },
    output:
      '1 result is available, use up and down arrow keys to navigate. Press Enter key to select.',
  },
]

tests.forEach(({input, output}) => {
  test(`${JSON.stringify(input)} results in ${JSON.stringify(output)}`, () => {
    expect(getA11yStatusMessage(input)).toBe(output)
  })
})
