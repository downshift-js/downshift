import {handleRefs} from '../handleRefs'

test('handleRefs handles both ref functions and objects', () => {
  const refFunction = jest.fn() as unknown as React.RefCallback<HTMLElement>
  const refObject = {
    current: null,
  } as unknown as React.MutableRefObject<HTMLElement>
  const refs = [refFunction, refObject]
  const node = {} as unknown as HTMLElement
  const ref = handleRefs(...refs)

  ref(node)

  expect(refFunction).toHaveBeenCalledTimes(1)
  expect(refFunction).toHaveBeenCalledWith(node)
  expect(refObject.current).toEqual(node)
})
