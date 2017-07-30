import React from 'react'
import styled from 'styled-components'

import Autocomplete from '../../other/react-autocompletely'

const ItemWrapper = styled(Autocomplete.Item)`
  cursor: pointer;
  padding: 12px 16px;
  transition: background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1) 0ms;
  &:hover {
    background-color: rgb(232, 232, 232);
  }
`

const DisplayText = styled.span`
  ${props => props.isActive && {fontWeight: 'bold'}};
`

function Item(props) {
  const {value, index, displayText, isActive} = props
  return (
    <ItemWrapper value={value} index={index}>
      <DisplayText isActive={isActive}>
        {displayText}
      </DisplayText>
    </ItemWrapper>
  )
}

export default Item
