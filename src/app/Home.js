import React, {Component} from 'react';
import './Home.css'
import RegionSelect from './RegionSelect'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: 'na',
      searchValue: '',
      regionSelectVisible: false
    }
  }

  handleInputChange = event => {
    this.setState({
      searchValue: event.target.value
    });
  };

  handleRegionSelect = newRegion => {
    this.setState({
      region: newRegion,
      regionSelectVisible: false
    })
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
          <button className="find-region" type="button" onClick={() => this.setState({regionSelectVisible: true})}>{this.state.region.toUpperCase()}</button>
          <button className="find-summoner" type="button">GO!</button>
        </form>
        {
          this.state.regionSelectVisible ? <RegionSelect handleRegionSelect={this.handleRegionSelect}/> : null
        }
      </div>
    )
  }
}