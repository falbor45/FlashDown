import React, {Component} from 'react';
import './Home.css'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: 'na',
      searchValue: ''
    }
  }

  handleInputChange = event => {
    this.setState({
      searchValue: event.target.value
    });
  };

  render() {
    return (
      <div className="home-wrapper">
        <form className="summoner-search-form">
          <input className="search-input"
                 type="text"
                 placeholder="Search for summoner here..."
                 value={this.state.searchValue}
                 onChange={e => this.handleInputChange(e)}/>
          <button className="find-region">{this.state.region.toUpperCase()}</button>
          <button className="find-summoner">GO!</button>
        </form>
      </div>
    )
  }
}