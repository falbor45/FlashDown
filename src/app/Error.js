import React, { Component } from 'react'
import './Error.css'

export default class Error extends Component {
  render() {
    return (
      <div className="error">
        <p>Error:</p>
        <p>{this.props.message}</p>
      </div>
    )
  }
}