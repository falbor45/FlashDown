import React, { Component } from 'react'
import './Match.css'
import MediaQuery from 'react-responsive'


export default class Match extends Component {

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
  };

  shortenSummonerName = summonerName => summonerName.replace(' ', '').toLowerCase();

  render() {
    return (
      <div className="match">
        <div className="match-queue-type">
          <p>{this.determineQueueType(this.props.queueId)}</p>
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
                  <img src={this.props.mainSummoner.stats.primaryPerk.slots[0].runes.find(el => el.id === this.props.mainSummoner.stats.perk0).icon}/>
                  <img src={this.props.mainSummoner.stats.secondaryPerk.icon}/>
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
              {
                this.props.allParticipants.map(e =>
                    <div>
                      <img src={e.champion.iconURL}/>
                      <span><a
                        href={`http://${window.location.host}/summoner/${this.props.match.params.leagueServer}/${this.shortenSummonerName(e.summonerName)}`}>{e.summonerName}</a></span>
                    </div>
                  )
              }
            </div>
          </MediaQuery>
        </div>
      </div>
    )
  }
}