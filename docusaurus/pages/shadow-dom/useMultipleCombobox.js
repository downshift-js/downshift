import * as React from 'react'

import DropdownMultipleCombobox from '../useMultipleCombobox'
import {ReactShadowRoot} from '../../../test/react-shadow'

const style = {
  padding: '20px',
}

export default function MultipleComboboxShadow() {
  return (
    <div style={style}>
      <div>
        <button>Button before shadow root</button>
      </div>
      <h2>Shadow DOM</h2>
      <div data-testid="shadow-root">
        <ReactShadowRoot>
          <DropdownMultipleCombobox />
        </ReactShadowRoot>
      </div>
      <div>
        <button>Button after shadow root</button>
      </div>
    </div>
  )
}
