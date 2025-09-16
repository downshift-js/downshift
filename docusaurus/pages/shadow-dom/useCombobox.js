import * as React from 'react'

import DropdownCombobox from '../useCombobox'
import {ReactShadowRoot} from '../../../test/react-shadow'

const style = {
  padding: '20px',
}

export default function MultipleComboboxShadow() {
  return (
    <div style={style}>
      <h2>Shadow DOM</h2>
      <div data-testid="shadow-root">
        <ReactShadowRoot>
          <DropdownCombobox />
        </ReactShadowRoot>
      </div>
    </div>
  )
}
