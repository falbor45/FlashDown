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
  };

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

    let days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`
  };

  unrankedLeaguePlaceholder = () => (
    <div className="summoner-queue">
      <img src={`/${UnrankedLeague}`}/>
    </div>
  )


  render() {
    if (typeof window !== 'undefined' && !this.state.fetched) {
      fetch(`http://${window.location.host}:3000/summoner/${this.props.match.params.leagueServer}/${this.props.match.params.summonerName}`)
        .then(response => response.json())
        .then(json => {
          console.log(json)
          this.setState({
            data: json,
            soloQ: json.queueData.find(x => x.queueType === 'RANKED_SOLO_5x5') || null,
            flexQ: json.queueData.find(x => x.queueType === 'RANKED_FLEX_SR') || null,
            flex3: json.queueData.find(x => x.queueType === 'RANKED_FLEX_TT') || null,
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
                  this.state.soloQ !== null ? <div className="summoner-queue">
                    <img src={`/${this.determineLeagueIcon(this.state.soloQ.tier)}`}/>
                    <p className="league-type">{this.determineLeagueType(this.state.soloQ.queueType)}</p>
                    <p className="league">
                      {this.state.soloQ.tier} {this.state.soloQ.rank}
                      <p>{this.state.soloQ.leaguePoints} LP</p>
                    </p>
                    <p className="league-win-loss">
                      Wins: {this.state.soloQ.wins} Losses: {this.state.soloQ.losses}
                      <p>Win ratio: {Math.floor((this.state.soloQ.wins / (this.state.soloQ.wins + this.state.soloQ.losses)) * 100)}%</p>
                    </p>
                  </div> : this.unrankedLeaguePlaceholder()
                }
                {
                  this.state.flexQ !== null ? <div className="summoner-queue">
                    <img src={`/${this.determineLeagueIcon(this.state.flexQ.tier)}`}/>
                    <p className="league-type">{this.determineLeagueType(this.state.flexQ.queueType)}</p>
                    <p className="league">
                      {this.state.flexQ.tier} {this.state.flexQ.rank}
                      <p>{this.state.flexQ.leaguePoints} LP</p>
                    </p>
                    <p className="league-win-loss">
                      Wins: {this.state.flexQ.wins} Losses: {this.state.flexQ.losses}
                      <p>Win ratio: {Math.floor((this.state.flexQ.wins / (this.state.flexQ.wins + this.state.flexQ.losses)) * 100)}%</p>
                    </p>
                  </div> : this.unrankedLeaguePlaceholder()
                }
                {
                  this.state.flex3 !== null ? <div className="summoner-queue">
                    <img src={`/${this.determineLeagueIcon(this.state.flex3.tier)}`}/>
                    <p className="league-type">{this.determineLeagueType(this.state.flex3.queueType)}</p>
                    <p className="league">
                      {this.state.flex3.tier} {this.state.flex3.rank}
                      <p>{this.state.flex3.leaguePoints} LP</p>
                    </p>
                    <p className="league-win-loss">
                      Wins: {this.state.flex3.wins} Losses: {this.state.flex3.losses}
                      <p>Win ratio: {Math.floor((this.state.flex3.wins / (this.state.flex3.wins + this.state.flex3.losses)) * 100)}%</p>
                    </p>
                  </div> : this.unrankedLeaguePlaceholder()
                }
              </div>
            </div> :
            <div></div>
        }
      </div>
    )
  }
}