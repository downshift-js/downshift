import {targetWithinDownshift} from '../targetWithinDownshift'

describe('targetWithinDownshift', () => {
  test('returns false when environment is undefined', () => {
    expect(
      targetWithinDownshift(
        document.createElement('div'),
        [document.createElement('div')],
        undefined,
      ),
    ).toBe(false)
  })

  test('returns true when target is a downshift element', () => {
    const element = document.createElement('div')
    expect(
      targetWithinDownshift(element, [element], window),
    ).toBe(true)
  })

  test('returns false when target is not a downshift element', () => {
    expect(
      targetWithinDownshift(
        document.createElement('div'),
        [document.createElement('div')],
        window,
      ),
    ).toBe(false)
  })

  test('returns true when activeElement is a downshift element and checkActiveElement is true', () => {
    const element = document.createElement('div')
    element.setAttribute('tabindex', '-1')
    document.body.appendChild(element)
    element.focus()

    expect(
      targetWithinDownshift(
        document.createElement('div'),
        [element],
        window,
        true,
      ),
    ).toBe(true)

    document.body.removeChild(element)
  })

  test('returns false when activeElement is a downshift element but checkActiveElement is false', () => {
    const element = document.createElement('div')
    element.setAttribute('tabindex', '-1')
    document.body.appendChild(element)
    element.focus()

    expect(
      targetWithinDownshift(
        document.createElement('div'),
        [element],
        window,
        false,
      ),
    ).toBe(false)

    document.body.removeChild(element)
  })

  test('returns true when target is contained within a downshift element', () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')
    parent.appendChild(child)

    expect(
      targetWithinDownshift(child, [parent], window),
    ).toBe(true)
  })

  test('returns false when target is not contained within a downshift element', () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')

    expect(
      targetWithinDownshift(child, [parent], window),
    ).toBe(false)
  })

  test('returns false when target is not a Node instance', () => {
    const element = document.createElement('div')

    expect(
      targetWithinDownshift({} as EventTarget, [element], window),
    ).toBe(false)
  })
})
