import * as React from 'react'

import DropdownMultipleCombobox from '../useMultipleCombobox'
import {ReactShadowRoot} from '../../../test/react-shadow'

export default function MultipleComboboxShadow() {
  return (
    <div data-testid="shadow-root">
      <ReactShadowRoot>
        <h2>Shadow DOM</h2>
        <DropdownMultipleCombobox />
      </ReactShadowRoot>
    </div>
  )
}
