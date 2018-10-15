import React, {Component} from 'react'
import 'fetch-everywhere'
import MediaQuery from 'react-responsive'
import './SummonerStats.css'
import Match from './Match.js'
import SummonerOverview from './SummonerOverview'
import SummonerQueue from './SummonerQueue.js'

export default class SummonerStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      fetched: false,
      roomCode: null
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

    let days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`
  };

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

  showLiveGame = () => {
    if (this.state.roomCode !== null) {
      window.open(`http://${window.location.host}/gamerooms/${this.state.roomCode}`, '_blank')
      return null;
    }
    fetch(`http://${window.location.host}:3000/create-game-room/${this.props.match.params.leagueServer}/${this.props.match.params.summonerName}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({
          roomCode: json.roomCode
        })
      })
      .then(() => window.open(`http://${window.location.host}/gamerooms/${this.state.roomCode}`, '_blank'))
      .catch(err => console.log(err));
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
                    .filter(x => x.summonerName.toLowerCase() === this.props.match.params.summonerName.toLowerCase())[0]
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
                  <button onClick={() => this.showLiveGame()}
                          className="summoner-live-game"
                          type="button">Live game</button>
                </div>
              </div>
              <SummonerQueue
                soloQ={this.state.data.soloQ}
                flexQ={this.state.data.flexQ}
                flex3={this.state.data.flex3}/>
              <div className="summoner-main-view">
                <MediaQuery query="(min-width: 1200px)">
                  <SummonerOverview recentMatches={this.state.data.recentMatches}/>
                </MediaQuery>
                <div className="recent-matches">
                  {
                    this.state.data.recentMatches
                      .sort((a, b) => b.gameCreation - a.gameCreation)
                      .map(e => e.hasOwnProperty('gameId') ?
                        <Match
                          gameDuration={e.gameDuration}
                          timeAgo={this.calculateLastSeen(e.gameCreation)}
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
              </div>
            </div> :
            <div></div>
        }
      </div>
    )
  }
}