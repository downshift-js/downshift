import {
  ItemClick,
  MenuKeyDownEnter,
  FunctionSelectItem,
  MenuKeyDownArrowDown,
} from '../stateChangeTypes'
import propCallbacks from '../propCallbacks'

describe('useSelectCallbacks', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => console.error.mockRestore())

  it('should perform onItemSelected for 3 specific stateChangeTypes', () => {
    const props = {onItemSelected: jest.fn()}
    const newState = {selectedItem: 'abc'}
    const actionTypes = [ItemClick, MenuKeyDownEnter, FunctionSelectItem]

    for (let index = 0; index < actionTypes.length; index++) {
      const action = {type: actionTypes[index], props}
      propCallbacks(action, newState)
    }

    expect(props.onItemSelected).toHaveBeenCalledTimes(3)
    expect(props.onItemSelected).toHaveBeenCalledWith(newState)
  })

  it('should not error if no onItemSelected is passed', () => {
    const action = {type: ItemClick, props: {}}
    const newState = {selectedItem: 'abc'}

    propCallbacks(action, newState)

    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it('should not perform callback on other stateChangeTypes', () => {
    const props = {onItemSelected: jest.fn()}
    const action = {type: MenuKeyDownArrowDown, props}
    const newState = {selectedItem: 'abc'}

    propCallbacks(action, newState)

    expect(props.onItemSelected).toHaveBeenCalledTimes(0)
  })
})
