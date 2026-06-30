/* eslint-disable */
// this file is a compiled version of `useCombobox.jsx`.
// It was created via [the React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEAVAQIZgEBKCpchAZjBBgQOQw12sA6Adn5hz4CwAlDAIAwswBGEOQA8CAXwKNmbAHSaA9Np1h4PXoNyFRcCABtcFVepat9UPGithjp4U4MALUhwAJppwYB58fAgKQoSBCPSkUFYMULx0aBC8BAAiTFiBEADuvNIYcooAFACUInwEBJa8YIQA2mi8WC4AkngIGGAANAQSeF0d3b39ALoEALxUnHia4ggAynikvRWWNjBgVXUNmc21WfUEaGAA8lgIvAOH9QDmCHgAKhBPT1YIAEIueEyAAU8oNHgQXngADKkGQIKwgiBYMFnZ6vACydygiORD1RENeY06eBxKPOBF8aCevisVN8vUCYziCjx5MhPT6pNZ5wkPzoCEZk259V5CDoHIw3NU8xWpXKEAUFWA4LQkzAyAu41GauFBEyRJcADVSFYoFJ-LwXhqlZricbTQgVDVZgA+U7kkWErUSsAVcHkna2TT0Ny9GAVVV9OYu-0eyMYTSAqFFBAwSTkBDVTTNAJ4MAAdVVvgjWvtZsTEGThVT6Yk1SquvJDdjB3xyilrfqHDwsCyfvxAB5AmgAG4NKzkMAAOVIGAQs24IEaG3aqcXMfx9QHE7hVljIrwAE8frNgMrNx76Jk8PmEHS8BrWHIrHEYKxGx7AzANaL+YKowA-MM8JigyEoEI+MgTnAADW777ioygIcA2iaJCMK7qS1RIReG4eucki+BAEASGQWQgXOvAPrGA46Du8J4R6Q6jox+EDu0xIIQex7zmeBBYKQgTDpaj4ACxYAorCIVxIioeyWpYVUOH4eSgSbKQAC0vTNGggQLkusjyAqGkcS4i4ITorFMTIAKZDJzQ8aeogCUJ7RPGJEkEAAHBJUnKMpKn1AEaCafRVj6YCXw-AQlFQOZF6qepWkIDpemLpYZRGQoWmfN8CAaTZeCAvwIAySh2iQh8UV-LZvCKQF+FWfhwCXDcdwEEBA4ugAZAAxF5ACsACcADMADctFuhqXV9YNQ0DRNlkNUxOiFcVTXnAOa12QlPJHiefEucJ7lsOJSg+ZJ0m7UFMAhRpYX6XAPwBMBfKuHZpXXQQakbMlqWPc9MAFbV8WBfUmSSLSsGntU0avaBEoVLwSRWEpCEbeSfUAIwAAx4wA7GNCG0dtvAbbRw4juTSSyRVGJYvV46TjOc76bF67Ia1tz8F9QGmdqfRgJoGCkFgFQRkKmrMs6br9mDm20jJ5IOQd57y-hR1uR5kkfvLMi0DBTxMKkgTSLsyBKyplLUrS1JgbwzJzLM8ztI7QGsL1MhxKJ9D0FJGom-Eq6BLrKn+Zb9QwQgh6ngABgAJC1kzKInrtRMosfLfL5VoYSkxYWr6vkvGoeBWnLIR+crA-Zp2muIErAarHBTFGAlL0HgJmTBpqcO+nselx6yho199QYypSd9FnKm0bS4-1FUnZgxqyNWFY0+0UkVkUyxhytjhIADAZvAhk8KAgIXOg6BlWBuJsGS8OiEBxBqi4mnun3KIf4BEYUYxhrwE0YAUAJHcAgZQQA)

import {c as _c} from 'react-compiler-runtime'
import * as React from 'react'

import {useCombobox} from '../../src'
import {colors} from '../utils'
import './shared.css'

export default function DropdownCombobox() {
  const $ = _c(44)
  const [inputItems, setInputItems] = React.useState(colors)
  let t0
  if ($[0] === Symbol.for('react.memo_cache_sentinel')) {
    t0 = t1 => {
      const {inputValue} = t1
      setInputItems(
        colors.filter(item =>
          item.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      )
    }
    $[0] = t0
  } else {
    t0 = $[0]
  }
  let t1
  if ($[1] !== inputItems) {
    t1 = {items: inputItems, onInputValueChange: t0}
    $[1] = inputItems
    $[2] = t1
  } else {
    t1 = $[2]
  }
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    selectItem,
  } = useCombobox(t1)

  const t2 = selectedItem ? selectedItem : 'black'
  let t3
  if ($[3] !== t2) {
    t3 = {fontWeight: 'bolder', color: t2}
    $[3] = t2
    $[4] = t3
  } else {
    t3 = $[4]
  }
  let t4
  if ($[5] !== getLabelProps) {
    t4 = getLabelProps()
    $[5] = getLabelProps
    $[6] = t4
  } else {
    t4 = $[6]
  }
  let t5
  if ($[7] !== t3 || $[8] !== t4) {
    t5 = (
      <label style={t3} {...t4}>
        Choose an element:
      </label>
    )
    $[7] = t3
    $[8] = t4
    $[9] = t5
  } else {
    t5 = $[9]
  }
  let t6
  if ($[10] === Symbol.for('react.memo_cache_sentinel')) {
    t6 = {padding: '4px'}
    $[10] = t6
  } else {
    t6 = $[10]
  }
  let t7
  if ($[11] !== getInputProps) {
    t7 = getInputProps()
    $[11] = getInputProps
    $[12] = t7
  } else {
    t7 = $[12]
  }
  let t8
  if ($[13] !== t7) {
    t8 = <input style={t6} {...t7} data-testid="combobox-input" />
    $[13] = t7
    $[14] = t8
  } else {
    t8 = $[14]
  }
  let t9
  if ($[15] === Symbol.for('react.memo_cache_sentinel')) {
    t9 = {padding: '4px 8px'}
    $[15] = t9
  } else {
    t9 = $[15]
  }
  let t10
  if ($[16] !== getToggleButtonProps) {
    t10 = getToggleButtonProps()
    $[16] = getToggleButtonProps
    $[17] = t10
  } else {
    t10 = $[17]
  }
  let t11
  if ($[18] !== isOpen) {
    t11 = isOpen ? <>↑</> : <>↓</>
    $[18] = isOpen
    $[19] = t11
  } else {
    t11 = $[19]
  }
  let t12
  if ($[20] !== t10 || $[21] !== t11) {
    t12 = (
      <button
        style={t9}
        aria-label="toggle menu"
        data-testid="combobox-toggle-button"
        {...t10}
      >
        {t11}
      </button>
    )
    $[20] = t10
    $[21] = t11
    $[22] = t12
  } else {
    t12 = $[22]
  }
  let t13
  if ($[23] === Symbol.for('react.memo_cache_sentinel')) {
    t13 = {padding: '4px 8px'}
    $[23] = t13
  } else {
    t13 = $[23]
  }
  let t14
  if ($[24] !== selectItem) {
    t14 = (
      <button
        style={t13}
        aria-label="clear selection"
        data-testid="clear-button"
        onClick={() => selectItem(null)}
      >
        ✗
      </button>
    )
    $[24] = selectItem
    $[25] = t14
  } else {
    t14 = $[25]
  }
  let t15
  if ($[26] !== t12 || $[27] !== t14 || $[28] !== t8) {
    t15 = (
      <div>
        {t8}
        {t12}
        {t14}
      </div>
    )
    $[26] = t12
    $[27] = t14
    $[28] = t8
    $[29] = t15
  } else {
    t15 = $[29]
  }
  let t16
  if ($[30] !== getMenuProps) {
    t16 = getMenuProps()
    $[30] = getMenuProps
    $[31] = t16
  } else {
    t16 = $[31]
  }
  let t17
  if (
    $[32] !== getItemProps ||
    $[33] !== highlightedIndex ||
    $[34] !== inputItems ||
    $[35] !== isOpen
  ) {
    t17 = isOpen
      ? inputItems.map((item_0, index) => (
          <li
            style={{
              padding: '4px',
              backgroundColor:
                highlightedIndex === index ? '#bde4ff' : undefined,
            }}
            key={`${item_0}${index}`}
            {...getItemProps({
              item: item_0,
              index,
              'data-testid': `downshift-item-${index}`,
            })}
          >
            {item_0}
          </li>
        ))
      : null
    $[32] = getItemProps
    $[33] = highlightedIndex
    $[34] = inputItems
    $[35] = isOpen
    $[36] = t17
  } else {
    t17 = $[36]
  }
  let t18
  if ($[37] !== t16 || $[38] !== t17) {
    t18 = (
      <ul {...t16} className="menu">
        {t17}
      </ul>
    )
    $[37] = t16
    $[38] = t17
    $[39] = t18
  } else {
    t18 = $[39]
  }
  let t19
  if ($[40] !== t15 || $[41] !== t18 || $[42] !== t5) {
    t19 = (
      <div className="container">
        {t5}
        {t15}
        {t18}
      </div>
    )
    $[40] = t15
    $[41] = t18
    $[42] = t5
    $[43] = t19
  } else {
    t19 = $[43]
  }
  return t19
}
