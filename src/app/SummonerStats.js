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

  determineQueueType = queueId => {
    switch (queueId) {
      case 0: {
        return "Custom game";
      }
      case 72:
      case 73: {
        return "Snowdown";
      }
      case 75: {
        return "Hexakill";
      }
      case 76:
      case 83: {
        return "URF";
      }
      case 78:
      case 1020: {
        return "One for All";
      }
      case 98: {
        return "3v3 Hexakill";
      }
      case 100:
      case 450: {
        return "ARAM";
      }
      case 310: {
        return "Nemesis"
      }
      case 313: {
        return "Black Market Brawlers";
      }
      case 317: {
        return "Definitely Not Dominion";
      }
      case 325: {
        return "SR ARAM";
      }
      case 400: {
        return "5v5 Draft Pick"
      }
      case 420: {
        return "5v5 Ranked Solo"
      }
      case 430: {
        return "5v5 Blind Pick"
      }
      case 440: {
        return "5v5 Ranked Flex"
      }
      case 460: {
        return "3v3 Blind Pick"
      }
      case 470: {
        return "3v3 Ranked Flex"
      }
      case 600: {
        return "Blood Hunt Assassin"
      }
      case 610: {
        return "Dark Star: Singularity"
      }
      case 700: {
        return "Clash"
      }
      case 800:
      case 810:
      case 820:
      case 830:
      case 840:
      case 850: {
        return "vs. AI"
      }
      case 900:
      case 1010: {
        return "ARURF"
      }
      case 910: {
        return "Ascension"
      }
      case 920: {
        return "Legend of the Poro"
      }
      case 940: {
        return "Nexus Siege"
      }
      case 950:
      case 960: {
        return "Doom Bots"
      }
      case 980:
      case 990: {
        return "Star Guardian Invasion"
      }
      case 1000: {
        return "PROJECT: Hunters"
      }
      case 1200: {
        return "Nexus Blitz"
      }
    }
  }

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
                        <div className="match">
                          <div className="match-queue-type">
                            <p>{this.determineQueueType(e.queueId)}</p>
                          </div>
                          <div className="main-match-details">
                          {
                            this.mapParticipants(e.participants, e.participantIdentities)
                              .filter(x => this.shortenSummonerName(x.summonerName) === this.shortenSummonerName(this.props.match.params.summonerName))
                              .map(e =>
                                <div className="played-champion">
                                  <div className="played-champion-icons">
                                    <div className="played-champion-img">
                                      <img src={e.champion.iconURL}/>
                                    </div>
                                    <div className="played-champion-spells">
                                      <div>
                                        <img src={e.spell1Id.image}/>
                                        <img src={e.spell2Id.image}/>
                                      </div>
                                      <div>
                                        <img src={e.stats.primaryPerk.slots[0].runes.find(el => el.id === e.stats.perk0).icon}/>
                                        <img src={e.stats.secondaryPerk.icon}/>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="played-champion-name">{e.champion.name}</p>
                                  <p className={e.stats.win ? 'match-win' : 'match-lose'}>{e.stats.win ? 'Win' : 'Lose'}</p>
                                </div>
                              )
                          }
                          {
                            this.mapParticipants(e.participants, e.participantIdentities)
                              .filter(x => this.shortenSummonerName(x.summonerName) === this.shortenSummonerName(this.props.match.params.summonerName))
                              .map(e =>
                              <div className="kda">
                                <p>
                                  {e.stats.kills} /
                                  <span> {e.stats.deaths} </span>
                                   / {e.stats.assists}
                                </p>
                                <p>
                                  {((e.stats.kills + e.stats.assists) / (e.stats.deaths || 1)).toFixed(2)}
                                  <span> KDA</span>
                                </p>
                              </div>
                              )
                          }
                          {
                            this.mapParticipants(e.participants, e.participantIdentities)
                              .filter(x => this.shortenSummonerName(x.summonerName) === this.shortenSummonerName(this.props.match.params.summonerName))
                              .map(e =>
                                <div className="item-list">
                                  {
                                    [0, 1, 2, 6, 3, 4, 5].map(el => e.stats[`item${el}`] !== null ?
                                      <div>
                                          <img src={e.stats[`item${el}`]}/>
                                      </div> :
                                      <div className="no-item">
                                      </div>

                                    )
                                  }
                                </div>
                              )
                          }
                          </div>
                        </div> : <div></div>
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