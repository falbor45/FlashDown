import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import './Home.css'
import RegionSelect from './RegionSelect'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: 'na',
      searchValue: '',
      regionSelectVisible: false,
      challengerPlayers: null,
      showChallengerPlayers: false
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

  handleSubmit = () => {
    this.props.history.push(`/summoner/${this.state.region}/${this.state.searchValue}`);
  };

  toggleChallengersList = show => {
      this.setState({
        showChallengerPlayers: show
      })
  };

  fetchChallengerPlayers = region => {
    this.setState({
      challengerPlayers: null
    });
    fetch(`http://${window.location.host}:3000/challengerPlayers/${region}`)
      .then(response => response.json())
      .then(json => this.setState({
        challengerPlayers: json
      }))
      .then(() => console.log(this.state.challengerPlayers))
  };

  componentDidMount() {
    this.fetchChallengerPlayers(this.state.region);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.region !== this.state.region) {
      console.log(prevState, this.state)
      this.fetchChallengerPlayers(this.state.region)
    }
  }

  render() {
    return (
      <div className="home-wrapper">
        <form className="summoner-search-form"
              onSubmit={this.handleSubmit}
              onFocus={() => this.toggleChallengersList(true)}>
          <input className={`search-input ${this.state.showChallengerPlayers ? 'search-input-dropdown' : ''}`}
                 type="text"
                 placeholder="Search for summoner here..."
                 value={this.state.searchValue}
                 onChange={e => this.handleInputChange(e)}/>
          <button className="find-region" type="button" onClick={() => this.setState({regionSelectVisible: true})}>{this.state.region.toUpperCase()}</button>
          <Link to={`/summoner/${this.state.region}/${this.state.searchValue}`}>
            <button className="find-summoner" type="button">GO!</button>
          </Link>
          {
            this.state.showChallengerPlayers && this.state.challengerPlayers !== null ?
              <div className="challengers-list">
                <p className="challengers-title">Best players of the region</p>
                {
                  this.state.challengerPlayers.entries
                    .sort((a, b) => b.leaguePoints - a.leaguePoints)
                    .map(e => (
                      <div className="challenger-item" >
                        <a href={`http://${window.location.host}/summoner/${this.state.region}/${e.playerOrTeamName.toLowerCase()}`}>{e.playerOrTeamName} ({e.leaguePoints} LP)</a>
                      </div>
                    ))
                }
              </div> : null
          }
        </form>
        {
          this.state.regionSelectVisible ? <RegionSelect handleRegionSelect={this.handleRegionSelect}/> : null
        }
      </div>
    )
  }
}