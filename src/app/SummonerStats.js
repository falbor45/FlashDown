import React, {Component} from 'react'
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
import Match from './Match.js'

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

  shortenSummonerName = summonerName => summonerName.replace(' ', '').toLowerCase();

  mapParticipants = (participants, participantsIdentities) => {
    let result = [];
    let participantsCopy = participants.sort(e => e.participantId);
    let participantsIdentitiesCopy = participantsIdentities.sort(e => e.participantId);

    for (let i = 0; i < participantsCopy.length; i++) {
      result.push({
        ...participantsCopy[i],
        summonerName: participantsIdentitiesCopy[i].player.summonerName,
        profileIcon: participantsIdentitiesCopy[i].player.profileIcon,
      })
    }

    return result;
  };


  render() {
    if (typeof window !== 'undefined' && !this.state.fetched) {
      fetch(`http://${window.location.host}:3000/summoner/${this.props.match.params.leagueServer}/${this.props.match.params.summonerName}`)
        .then(response => response.json())
        .then(json => {
          console.log(json)
          this.setState({
            data: {
              ...json,
              recentMatches: json.recentMatches.map(e => {
                return {
                  ...e,
                  searchedSummoner: this.mapParticipants(e.participants, e.participantIdentities)
                    .filter(x => this.shortenSummonerName(x.summonerName) === this.shortenSummonerName(this.props.match.params.summonerName))[0]
                }
              }),
              soloQ: json.queueData.find(x => x.queueType === 'RANKED_SOLO_5x5') || null,
              flexQ: json.queueData.find(x => x.queueType === 'RANKED_FLEX_SR') || null,
              flex3: json.queueData.find(x => x.queueType === 'RANKED_FLEX_TT') || null,
            },
            fetched: true
          })
        })
        .then(() => console.log(this.state))
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
                  this.state.data.soloQ !== null ? <div className="summoner-queue">
                    <img src={`/${this.determineLeagueIcon(this.state.data.soloQ.tier)}`}/>
                    <p className="league-type">{this.determineLeagueType(this.state.data.soloQ.queueType)}</p>
                    <p className="league">
                      {this.state.data.soloQ.tier} {this.state.data.soloQ.rank}
                      <p>{this.state.data.soloQ.leaguePoints} LP</p>
                    </p>
                    <p className="league-win-loss">
                      Wins: {this.state.data.soloQ.wins} Losses: {this.state.data.soloQ.losses}
                      <p>Win
                        ratio: {Math.floor((this.state.data.soloQ.wins / (this.state.data.soloQ.wins + this.state.data.soloQ.losses)) * 100)}%</p>
                    </p>
                  </div> : this.unrankedLeaguePlaceholder()
                }
                {
                  this.state.data.flexQ !== null ? <div className="summoner-queue">
                    <img src={`/${this.determineLeagueIcon(this.state.data.flexQ.tier)}`}/>
                    <p className="league-type">{this.determineLeagueType(this.state.data.flexQ.queueType)}</p>
                    <p className="league">
                      {this.state.data.flexQ.tier} {this.state.data.flexQ.rank}
                      <p>{this.state.data.flexQ.leaguePoints} LP</p>
                    </p>
                    <p className="league-win-loss">
                      Wins: {this.state.data.flexQ.wins} Losses: {this.state.data.flexQ.losses}
                      <p>Win
                        ratio: {Math.floor((this.state.data.flexQ.wins / (this.state.data.flexQ.wins + this.state.data.flexQ.losses)) * 100)}%</p>
                    </p>
                  </div> : this.unrankedLeaguePlaceholder()
                }
                {
                  this.state.data.flex3 !== null ? <div className="summoner-queue">
                    <img src={`/${this.determineLeagueIcon(this.state.data.flex3.tier)}`}/>
                    <p className="league-type">{this.determineLeagueType(this.state.data.flex3.queueType)}</p>
                    <p className="league">
                      {this.state.data.flex3.tier} {this.state.data.flex3.rank}
                      <p>{this.state.data.flex3.leaguePoints} LP</p>
                    </p>
                    <p className="league-win-loss">
                      Wins: {this.state.data.flex3.wins} Losses: {this.state.data.flex3.losses}
                      <p>Win
                        ratio: {Math.floor((this.state.data.flex3.wins / (this.state.data.flex3.wins + this.state.data.flex3.losses)) * 100)}%</p>
                    </p>
                  </div> : this.unrankedLeaguePlaceholder()
                }
              </div>
              <div className="recent-matches">
                {
                  this.state.data.recentMatches
                    .sort((a, b) => b.gameCreation - a.gameCreation)
                    .map(e => e.hasOwnProperty('gameId') ?
                      <Match
                        queueId={e.queueId}
                        mainSummoner={e.searchedSummoner}
                        allParticipants={
                          this.mapParticipants(e.participants, e.participantIdentities)
                        }
                        match={this.props.match}/>
                      : <div></div>
                    )
                }
              </div>
            </div> :
            <div></div>
        }
      </div>
    )
  }
}