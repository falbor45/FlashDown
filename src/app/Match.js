import React, { Component } from 'react'
import './Match.css'
import MediaQuery from 'react-responsive'
import { determineQueueType } from './Helpers.js';
import MatchDetails from './MatchDetails'


export default class Match extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpened: false
    }
  }


  shortenSummonerName = summonerName => summonerName.replace(' ', '').toLowerCase();

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

  determineGameLength = gameDuration => {
    let minutes = Math.floor(gameDuration / 60);
    let seconds = gameDuration - (minutes * 60);

    return `${minutes}m ${seconds}s`
  };

  render() {
    return (
      <div className="match">
        <div className="match-queue-type">
          <p>{determineQueueType(this.props.queueId)} - {this.determineGameLength(this.props.gameDuration)} - {this.props.timeAgo}</p>
        </div>
        <div className="main-match-details">
          <div className="played-champion">
            <div className="played-champion-icons">
              <div className="played-champion-img">
                <img src={this.props.mainSummoner.champion.iconURL}/>
              </div>
              <div className="played-champion-spells">
                <div>
                  <img src={this.props.mainSummoner.spell1Id.image}/>
                  <img src={this.props.mainSummoner.spell2Id.image}/>
                </div>
                <div>
                  {
                    this.props.mainSummoner.stats.hasOwnProperty('primaryPerk') ?
                      <img src={this.props.mainSummoner.stats.primaryPerk.slots[0].runes.find(el => el.id === this.props.mainSummoner.stats.perk0).icon}/> : null
                  }
                  {
                    this.props.mainSummoner.stats.hasOwnProperty('secondaryPerk') ?
                      <img src={this.props.mainSummoner.stats.secondaryPerk.icon}/> : null
                  }
                </div>
              </div>
            </div>
            <p className="played-champion-name">{this.props.mainSummoner.champion.name}</p>
            <p className={this.props.mainSummoner.stats.win ? 'match-win' : 'match-lose'}>{this.props.mainSummoner.stats.win ? 'Win' : 'Lose'}</p>
          </div>
          <div className="kda">
            <p>
              {this.props.mainSummoner.stats.kills} /
              <span> {this.props.mainSummoner.stats.deaths} </span>
              / {this.props.mainSummoner.stats.assists}
            </p>
            <p>
              {((this.props.mainSummoner.stats.kills + this.props.mainSummoner.stats.assists) / (this.props.mainSummoner.stats.deaths || 1)).toFixed(2)}
              <span> KDA</span>
            </p>
          </div>
          <div className="item-list">
            {
              [0, 1, 2, 6, 3, 4, 5].map(el => this.props.mainSummoner.stats[`item${el}`] !== null ?
                <div>
                  <img src={this.props.mainSummoner.stats[`item${el}`]}/>
                </div> :
                <div className="no-item">
                </div>
              )
            }
          </div>
          <MediaQuery query="(min-width: 1200px)">
            <div className="participants">
              <div>
                {
                  this.props.allParticipants
                    .filter(e => e.teamId === 100)
                    .map(e =>
                    <div>
                      <img src={e.champion.iconURL}/>
                      <div>
                        <a href={`http://${window.location.host}/summoner/${this.props.match.params.leagueServer}/${this.shortenSummonerName(e.summonerName)}`}>{e.summonerName}</a>
                      </div>
                    </div>
                  )
                }
              </div>
              <div>
                {
                  this.props.allParticipants
                    .filter(e => e.teamId === 200)
                    .map(e =>
                      <div>
                        <img src={e.champion.iconURL}/>
                        <div>
                          <a href={`http://${window.location.host}/summoner/${this.props.match.params.leagueServer}/${this.shortenSummonerName(e.summonerName)}`}>{e.summonerName}</a>
                        </div>
                      </div>
                    )
                }
              </div>
            </div>
          </MediaQuery>
        </div>
        {
          this.state.dropdownOpened ?
            <MatchDetails/> : <div></div>
        }
        <div className="match-dropdown" onClick={() => this.setState({ dropdownOpened: !this.state.dropdownOpened })}>
          {
            this.state.dropdownOpened ?
              <div className="arrow-up"></div> :
              <div className="arrow-down"></div>

          }
        </div>
      </div>
    )
  }
}