import {renderHook, act} from '@testing-library/react'
import {A11Y_DESCRIPTION_ELEMENT_ID, useAccessibleDescription} from '..'

describe('useAccessibleDescription', () => {
  test('adds a div element to the document that serves as accessible description', () => {
    const divElement = {
      setAttribute: jest.fn(),
      remove: jest.fn(),
      style: {display: ''},
      textContent: '',
    }

    const document: Document = {
      createElement: jest.fn().mockReturnValue(divElement),
      body: {
        appendChild: jest.fn(),
      },
    } as unknown as Document
    const description = 'press delete to remove'

    const {unmount} = renderHook(() => useAccessibleDescription(document, description))

    expect(document.createElement).toHaveBeenCalledTimes(1)
    expect(document.createElement).toHaveBeenCalledWith('div')
    expect(divElement.setAttribute).toHaveBeenCalledTimes(1)
    expect(divElement.setAttribute).toHaveBeenCalledWith(
      'id',
      A11Y_DESCRIPTION_ELEMENT_ID,
    )
    // eslint-disable-next-line jest-dom/prefer-to-have-style
    expect(divElement.style.display).toEqual('none')
    // eslint-disable-next-line jest-dom/prefer-to-have-text-content
    expect(divElement.textContent).toEqual(description)
    expect(document.body.appendChild).toHaveBeenCalledTimes(1)
    expect(document.body.appendChild).toHaveBeenCalledWith(divElement)

    act(() => {
      unmount()
    })

    expect(divElement.remove).toHaveBeenCalledTimes(1)
  })
})
