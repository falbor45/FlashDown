import React, {Component} from 'react'
import 'fetch-everywhere'
import MediaQuery from 'react-responsive'
import './SummonerStats.css'
import Match from './Match.js'
import SummonerOverview from './SummonerOverview'
import SummonerQueue from './SummonerQueue.js'
import { findNextSemicolon } from './Helpers';

export default class SummonerStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summonerData: null,
      fetchState: 'not started',
      roomCode: null,
      recentMatches: null,
      inGame: null,
      error: null
    }
  }

  setRecentSearchCookies = (region, summonerName) => {
    let searchCookieIndex = document.cookie.indexOf(`${region}_search=`) + `${region}_search=`.length;
    let searchCookie = document.cookie.slice(searchCookieIndex, findNextSemicolon(document.cookie, searchCookieIndex));
    let searchCookieNames = searchCookie.split("%").filter(e => e !== "");
    if (searchCookieNames.includes(summonerName)) {
      return false;
    }
    searchCookieNames.push(summonerName);
    searchCookieNames.length > 10 ? searchCookieNames.shift() : null;
    document.cookie = `${region}_search=%${searchCookieNames.join("%")}%`;

    return true;
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

  mapParticipants = (participants, participantsIdentities) => {
    let result = [];
    let participantsCopy = participants.sort(e => e.participantId);
    let participantsIdentitiesCopy = participantsIdentities.sort(e => e.participantId);
    for (let i = 0; i < participantsCopy.length; i++) {
      result.push({
        ...participantsCopy[i],
        summonerName: participantsIdentitiesCopy[i].player.summonerName,
        profileIcon: participantsIdentitiesCopy[i].player.profileIcon,
        accountId: participantsIdentitiesCopy[i].player.accountId,
        currentAccountId: participantsIdentitiesCopy[i].player.currentAccountId,
      })
    }

    return result;
  };

  handleResponseStatus = response => {
    if (response.status && response.status !== 200) {
      this.setState({
        error: response.statusText
      });
      return null;
    }
    return response;
  };

  fetchSummonerDataAndMatches = (server, summonerName) => fetch(`http://${window.location.host}:3000/summoner/${server}/${summonerName}`)
    .then(response => response.json())
    .then(response => this.handleResponseStatus(response))
    .then(json => {
        this.setState({
          summonerData: {
            ...json,
            soloQ: json.queueData.find(x => x.queueType === 'RANKED_SOLO_5x5') || null,
            flexQ: json.queueData.find(x => x.queueType === 'RANKED_FLEX_SR') || null,
            flex3: json.queueData.find(x => x.queueType === 'RANKED_FLEX_TT') || null,
          }
        })
      })
    .then(() => {
      this.fetchRecentMatches(server, summonerName)
      this.fetchInGameStatus(server, summonerName)
    })
    .then(() => {
      this.setState({
        fetchState: 'done'
      })
    })
    .catch(err => console.log(err));

  fetchRecentMatches = (server, summonerName) => fetch(`http://${window.location.host}:3000/matchList/${server}/${summonerName}`)
    .then(response => response.json())
    .then(response => this.handleResponseStatus(response))
    .then(json => {
      this.setState({
        recentMatches: json.map(e => {
          return {
            ...e,
            searchedSummoner: this.mapParticipants(e.participants, e.participantIdentities)
              .filter(x => x.accountId === this.state.summonerData.accountId || x.currentAccountId === this.state.summonerData.accountId)[0]
          }
        })
      })
    })
    .catch(err => console.log(err))

  fetchInGameStatus = (server, summonerName) => fetch(`http://${window.location.host}:3000/isInGame/${server}/${summonerName}`)
    .then(response => response.json())
    .then(response => this.handleResponseStatus(response))
    .then(inGame => {
      this.setState({
        inGame: inGame
      })
    })
    .catch(err => console.log(err));

  showLiveGame = () => {
    if (this.state.roomCode !== null) {
      window.open(`http://${window.location.host}/gamerooms/${this.state.roomCode}`, '_blank')
      return null;
    }
    fetch(`http://${window.location.host}:3000/create-game-room/${this.props.match.params.leagueServer}/${this.props.match.params.summonerName}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          roomCode: json.roomCode
        })
      })
      .then(() => window.open(`http://${window.location.host}/gamerooms/${this.state.roomCode}`, '_blank'))
      .catch(err => console.log(err));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.summonerData !== this.state.summonerData) {
      this.setRecentSearchCookies(this.props.match.params.leagueServer.toLowerCase(), this.state.summonerData.name)
    }
  }

  render() {
    if (typeof window !== 'undefined' && this.state.fetchState === 'not started') {
      this.setState({
        fetchState: 'fetching'
      });
      this.fetchSummonerDataAndMatches(this.props.match.params.leagueServer, this.props.match.params.summonerName);
    }
    return (
      <div>
        {
          this.state.summonerData !== null && this.state.error === null ?
            <div className="summoner-view">
              <div className="summoner-header">
                <div className="summoner-icon">
                  <img src={this.state.summonerData.profileIconURL} alt="summonerIcon"/>
                  <span>{this.state.summonerData.summonerLevel}</span>
                </div>
                <div className="summoner-misc-info">
                  <p className="summoner-name">{this.state.summonerData.name}</p>
                  <p className="summoner-last-seen">Last seen: {this.calculateLastSeen(this.state.summonerData.lastSeen)}</p>
                  {
                    this.state.inGame === true ?
                      <button onClick={() => this.showLiveGame()}
                              className="summoner-live-game"
                              type="button">Live game</button> : null
                  }
                </div>
              </div>
              <SummonerQueue
                soloQ={this.state.summonerData.soloQ}
                flexQ={this.state.summonerData.flexQ}
                flex3={this.state.summonerData.flex3}/>
              {
                this.state.recentMatches !== null ?
                  <div className="summoner-main-view">
                    <MediaQuery query="(min-width: 1200px)">
                      <SummonerOverview recentMatches={this.state.recentMatches}/>
                    </MediaQuery>
                    <div className="recent-matches">
                      {
                        this.state.recentMatches
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
                  </div> : <div></div>
              }
            </div> :
            <div></div>
        }
        {
          this.state.error ? <p>{this.state.error}</p> : null
        }
      </div>
    )
  }
}