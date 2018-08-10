import React, { Component } from 'react'
import 'fetch-everywhere'
import './SummonerStats.css'
import ChallengerLeague from './assets/challenger.png'
import MasterLeague from './assets/master.png'
import DiamondLeague from './assets/diamond.png'
import PlatinumLeague from './assets/platinum.png'
import GoldLeague from './assets/gold.png'
import SilverLeague from './assets/silver.png'
import BronzeLeague from './assets/bronze.png'
import UnrankedLeague from './assets/unranked.png'

export default class SummonerStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      fetched: false
    }
  }

  determineLeagueIcon = league => {
    switch (league) {
      case 'CHALLENGER': {
        return ChallengerLeague
      }
      case 'MASTER': {
        return MasterLeague
      }
      case 'DIAMOND': {
        return DiamondLeague
      }
      case 'PLATINUM': {
        return PlatinumLeague
      }
      case 'GOLD': {
        return GoldLeague
      }
      case 'SILVER': {
        return SilverLeague
      }
      case 'BRONZE': {
        return BronzeLeague
      }
      default: {
        return UnrankedLeague
      }
    }
  };

  determineLeagueType = type => {
    switch (type) {
      case 'RANKED_SOLO_5x5': {
        return 'Ranked, solo'
      }
      case 'RANKED_FLEX_SR': {
        return 'Ranked, flex'
      }
      case 'RANKED_FLEX_TT': {
        return 'Ranked, Twisted Treeline'
      }
    }
  }

  calculateLastSeen = time => {
    let seconds = (new Date().getTime() - time) / 1000;
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
          console.log(json)
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
            <div className="summoner-view">
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
              <div className="summoner-ranked">
                {
                  this.state.data.queueData.map(e => (
                    <div className="summoner-queue">
                      <img src={`/${this.determineLeagueIcon(e.tier)}`}/>
                      <p className="league-type">{this.determineLeagueType(e.queueType)}</p>
                      <p className="league">
                        {e.tier} {e.rank}
                        <p>{e.leaguePoints} LP</p>
                      </p>
                      <p className="league-win-loss">
                        Wins: {e.wins} Losses: {e.losses}
                        <p>Win ratio: {Math.floor((e.wins / (e.wins + e.losses)) * 100)}%</p>
                      </p>
                    </div>
                  ))
                }
              </div>
            </div> :
            <div></div>
        }
      </div>
    )
  }
}