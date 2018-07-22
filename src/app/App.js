import React, { Component } from 'react';
import propTypes from 'prop-types'

export default class App extends Component {
  static propTypes = {
    data: propTypes.object.isRequired
  };

  constructor (props) {
    super(props);

    this.state = {
      data: this.props.data
    }
  }
  render() {
    return (
      <div>
        <button onClick={() => console.log(this.state.data)}>Foo</button>
      </div>
    );
  }
}