import * as React from 'react'

import {cleanupStatusDiv, debounce, setStatus} from '../../utils-ts'
import {useIsInitialMount} from '.'

// eslint-disable-next-line
const { isReactNative } = require('../../is.macro.js');

/**
 * Debounced call for updating the a11y message.
 */
const updateA11yStatus = debounce((status: string, document: Document) => {
  setStatus(status, document)
}, 200)

/**
 * Adds an a11y aria live status message if getA11yStatusMessage is passed.
 * @param getA11yStatusMessage The function that builds the status message.
 * @param options The options to be passed to getA11yStatusMessage if called.
 * @param dependencyArray The dependency array that triggers the status message setter via useEffect.
 * @param environment The environment object containing the document.
 */
export function useA11yMessageStatus<Options>(
  getA11yStatusMessage: ((options: Options) => string) | undefined,
  options: Options,
  dependencyArray: unknown[],
  environment: {document: Document | undefined} | undefined,
) {
  const document = environment?.document
  const isInitialMount = useIsInitialMount()

  // Adds an a11y aria live status message if getA11yStatusMessage is passed.
  React.useEffect(() => {
    if (!getA11yStatusMessage || isInitialMount || isReactNative || !document) {
      return
    }

    const status = getA11yStatusMessage(options)

    updateA11yStatus(status, document)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray)

  // Cleanup the status message container.
  React.useEffect(() => {
    return () => {
      updateA11yStatus.cancel()
      cleanupStatusDiv(document)
    }
  }, [document])
}
