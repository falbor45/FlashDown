import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import './Home.css'
import RegionSelect from './RegionSelect'
import { findNextSemicolon } from './Helpers';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: 'na',
      searchValue: '',
      regionSelectVisible: false,
      challengerPlayers: null,
      searchHelpSection: 'topPlayers'
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

  readNamesFromSearchCookie = region => {
    if (document.cookie === "") {
      return null;
    }
    console.log(region)
    if (document.cookie.indexOf(`${region}_search=`) === -1) {
      return null;
    }
    let searchCookieIndex = document.cookie.indexOf(`${region}_search=`) + `${region}_search=`.length;
    console.log(searchCookieIndex)
    let searchCookie = document.cookie.slice(searchCookieIndex, findNextSemicolon(document.cookie, searchCookieIndex));
    console.log(searchCookie)
    return searchCookie.split("%").filter(e => e !== "");
  };

  componentDidMount() {
    this.fetchChallengerPlayers(this.state.region);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.region !== this.state.region) {
      this.fetchChallengerPlayers(this.state.region)
    }
  }

  render() {
    return (
      <div className="home-wrapper">
        <form className="summoner-search-form"
              onSubmit={this.handleSubmit}>
          <input className="search-input"
                 type="text"
                 placeholder="Search for summoner here..."
                 value={this.state.searchValue}
                 onChange={e => this.handleInputChange(e)}/>
          <button className="find-region" type="button" onClick={() => this.setState({regionSelectVisible: true})}>{this.state.region.toUpperCase()}</button>
          <Link to={`/summoner/${this.state.region}/${this.state.searchValue}`}>
            <button className="find-summoner" type="button">GO!</button>
          </Link>
          <div className="search-help">
          <button className={`search-help-button ${this.state.searchHelpSection === 'recentSearches' ? 'active' : ''}`} type="button" onClick={() => this.setState({searchHelpSection: 'recentSearches'})}>
            Recent searches
          </button>
          <button className={`search-help-button ${this.state.searchHelpSection === 'topPlayers' ? 'active' : ''}`} type="button" onClick={() => this.setState({searchHelpSection: 'topPlayers'})}>
            Top 10 region players
          </button>
            {
              this.state.searchHelpSection === 'topPlayers' && this.state.challengerPlayers !== null ?
                this.state.challengerPlayers.entries
                  .sort((a, b) => b.leaguePoints - a.leaguePoints)
                  .slice(0, 10)
                  .map(e => (
                    <div className="search-help-item">
                      <a href={`http://${window.location.host}/summoner/${this.state.region}/${e.playerOrTeamName.toLowerCase()}`}>{e.playerOrTeamName}
                        ({e.leaguePoints} LP)</a>
                    </div>
                  )) : null
            }
            {
              this.state.searchHelpSection === 'recentSearches' ?
                this.readNamesFromSearchCookie(this.state.region) !== null ?
                  this.readNamesFromSearchCookie(this.state.region)
                  .map(e => (
                    <div className="search-help-item">
                      <a href={`http://${window.location.host}/summoner/${this.state.region}/${e.toLowerCase()}`}>{e}</a>
                    </div>
                  )) :
                  <div className="search-help-no-recent-searches">
                    <p>No recent searches.</p>
                  </div> : null
            }
        </div>
        </form>
        {
          this.state.regionSelectVisible ? <RegionSelect handleRegionSelect={this.handleRegionSelect}/> : null
        }
      </div>
    )
  }
}