import React from 'react'
import styled from 'styled-components'

import items from '../../other/countries'
import Autocomplete from '../../other/react-autocompletely'

import Input from './Input'
import Menu from './Menu'

const Container = styled.div`position: relative;`

function MaterialAutoComplete(props) {
  const {dataSource, onSelect} = props
  return (
    <Container>
      <Autocomplete getValue={i => i.name} onChange={item => onSelect(item)}>
        <Input placeholder="Search a country" />
        <Menu dataSource={dataSource} />
      </Autocomplete>
    </Container>
  )
}

export default MaterialAutoComplete
