import React from 'react'
import styled from 'styled-components'

import Autocomplete from '../../other/react-autocompletely'
import Item from './Item'

const MenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  margin: 10px 0;
`

const Paper = styled.div`
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  max-height: 300px;
  overflow: auto;
`

function filterResult(arr, keyword) {
  return arr.filter(
    item => !keyword || item.name.toLowerCase().includes(keyword.toLowerCase()),
  )
}

function Menu(props) {
  const {dataSource, onSelect} = props
  return (
    <MenuWrapper>
      <Paper>
        <Autocomplete.Controller>
          {({isOpen, inputValue, selectedItem, highlightedIndex}) => {
            return (
              isOpen &&
              <div>
                {filterResult(dataSource, inputValue).map((item, index) =>
                  (<Item
                    value={item}
                    index={index}
                    key={item.code}
                    displayText={item.name}
                    isActive={
                      selectedItem ? selectedItem.code === item.code : false
                    }
                  />),
                )}
              </div>
            )
          }}
        </Autocomplete.Controller>
      </Paper>
    </MenuWrapper>
  )
}

export default Menu
