import React from 'react'
import styled from 'styled-components'

import MaterialAutoComplete from './MaterialAutoComplete'
import dataSource from '../../other/countries'

const ExampleWrapper = styled.div`
  @import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300ita‌​lic,400italic,500,500italic,700,700italic,900italic,900);
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 16px;
  width: 40%;
  margin: 0 auto;
  input {
    font-size: 16px;
  }
`

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: null,
    }
  }

  handleChange = selectedItem => {
    this.setState({selectedItem})
    alert(`${selectedItem.code} - ${selectedItem.name}`)
  }

  render() {
    const {selectedItem} = this.state
    return (
      <ExampleWrapper>
        <MaterialAutoComplete
          onSelect={this.handleChange}
          dataSource={dataSource}
          getValue={i => i.name}
        />
      </ExampleWrapper>
    )
  }
}

export default Example
