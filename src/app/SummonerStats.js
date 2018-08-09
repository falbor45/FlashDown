import React, { Component } from 'react'
import 'fetch-everywhere'
import './SummonerStats.css'

export default class SummonerStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      fetched: false
    }
  }

  calculateLastSeen = time => {
    let seconds = (new Date().getTime() - time) / 1000;
    console.log(seconds)
    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`
    }

    let minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }

    let hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    }

    return `${hours / 24} day${days === 1 ? '' : 's'} ago`
  }


  render() {
    if (typeof window !== 'undefined' && !this.state.fetched) {
      fetch(`http://${window.location.host}:3000/summoner/${this.props.match.params.leagueServer}/${this.props.match.params.summonerName}`)
        .then(response => response.json())
        .then(json => {
          this.setState({
            data: json,
            fetched: true
          })
        })
    }
    return (
      <div>
        {
          this.state.fetched ?
            <div>
              <div className="summoner-header">
                <div className="summoner-icon">
                  <img src={this.state.data.profileIconURL} alt="summonerIcon"/>
                  <span>{this.state.data.summonerLevel}</span>
                </div>
                <div className="summoner-misc-info">
                  <p className="summoner-name">{this.state.data.name}</p>
                  <p className="summoner-last-seen">Last seen: {this.calculateLastSeen(this.state.data.lastSeen)}</p>
                </div>
              </div>
            </div> :
            <div></div>
        }
      </div>
    )
  }
}