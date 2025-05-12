import * as React from 'react'

import DropdownSelect from '../useSelect'
import {ReactShadowRoot} from '../../../test/react-shadow'

export default function DropdownSelectShadow() {
  return <ReactShadowRoot>
    <DropdownSelect />
  </ReactShadowRoot>
}
