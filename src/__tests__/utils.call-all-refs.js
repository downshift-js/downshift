import {callAllRefs} from '../utils'

test('handle object and functinonal refs', () => {
  const refValue = 'Here could be your HTMLElement'

  const objectRef = {current: null}

  let functionRefValue = null
  const functionRef = ref => {
    functionRefValue = ref
  }

  const handleRef = callAllRefs(functionRef, objectRef)

  handleRef(refValue)
  expect(objectRef.current).toBe(refValue)
  expect(functionRefValue).toBe(refValue)
})
