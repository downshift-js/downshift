import React, {Component} from 'react'
import Basic from './basic'

class Examples extends Component {
  handleSubmit(evt) {
    evt.preventDefault()
    alert('Form submitted!')
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Basic />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default Examples
