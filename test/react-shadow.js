import React, {useState, useRef, useEffect} from 'react'
import ReactDOM from 'react-dom'

/**
 * Utility to render a component with a shadow root.
 *
 * Based on React Shadow: https://github.com/apearce/react-shadow-root/blob/master/src/lib/ReactShadowRoot.js
 */

const constructableStylesheetsSupported =
  typeof window !== 'undefined' &&
  window.ShadowRoot &&
  window.ShadowRoot.prototype.hasOwnProperty('adoptedStyleSheets') &&
  window.CSSStyleSheet &&
  window.CSSStyleSheet.prototype.hasOwnProperty('replace')

const shadowRootSupported =
  typeof window !== 'undefined' &&
  window.Element &&
  window.Element.prototype.hasOwnProperty('attachShadow')

/**
 * @param {object} props Properties passed to the component
 * @param {boolean} props.declarative  When true, uses a declarative shadow root
 * @param {boolean} props.delegatesFocus  Expands the focus behavior of elements within the shadow DOM.
 * @param {string} props.mode Sets the mode of the shadow root. (open or closed)
 * @param {CSSStyleSheet[]} props.stylesheets Takes an array of CSSStyleSheet objects for constructable stylesheets.
 */
const ReactShadowRoot = ({
  declarative = false,
  delegatesFocus = false,
  mode = 'open',
  stylesheets,
  children,
}) => {
  const [initialized, setInitialized] = useState(false)
  const placeholder = useRef(null)
  const shadowRootRef = useRef(null)

  useEffect(() => {
    if (placeholder.current) {
      shadowRootRef.current = placeholder.current.parentNode.attachShadow({
        delegatesFocus,
        mode,
      })

      if (stylesheets) {
        shadowRootRef.current.adoptedStyleSheets = stylesheets
      }

      setInitialized(true)
    }
  }, [delegatesFocus, mode, stylesheets])

  if (!initialized) {
    if (declarative) {
      // @ts-ignore
      return (
        <template ref={placeholder} shadowroot={mode}>
          {children}
        </template>
      )
    }

    return <span ref={placeholder}></span>
  }

  return ReactDOM.createPortal(children, shadowRootRef.current)
}

ReactShadowRoot.displayName = 'ReactShadowRoot'

export {ReactShadowRoot, constructableStylesheetsSupported, shadowRootSupported}
