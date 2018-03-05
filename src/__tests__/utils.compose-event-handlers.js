import {composeEventHandlers} from '../utils'

test('prevent default handlers when defaultPrevented is true', () => {
  const handler = composeEventHandlers(
    e => {
      e.defaultPrevented = true
    },
    () => {
      throw new Error(
        'preventing default should prevent default downshift behavior',
      )
    },
  )
  handler({})
})

test('prevent default handlers when defaultDownshiftPrevented is true', () => {
  const handler = composeEventHandlers(
    e => {
      e.preventDownshiftDefault = true
    },
    () => {
      throw new Error(
        'setting defaultDownshiftPrevented = true should prevent default downshift behavior',
      )
    },
  )
  handler({})
})

test('call default handler when defaultDownshiftPrevented and defaultPrevented are false', () => {
  let defaultCalled = false

  const handler = composeEventHandlers(
    () => {},
    () => {
      defaultCalled = true
    },
  )
  handler({})

  if (!defaultCalled) {
    throw new Error("default handler not called when default wasn't prevented")
  }
})
