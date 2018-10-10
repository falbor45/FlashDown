import React, { Component } from 'react'
import './MatchOverview.css'

export default class MatchOverview extends Component {
  render() {
    return (
      <div className="match-overview">
        <div className="team-blue">
          <div className="scoreboard-header">
              <p>Blue team {this.props.allParticipants.filter(e => e.teamId === 100)[0].stats.win ? "(Win)" : "(Loss)"}</p>
              <p>Items</p>
              <p>KDA</p>
              <p>Damage</p>
              <p>Gold</p>
          </div>
          <div className="scoreboard">
            {
              this.props.allParticipants
                .filter(e => e.teamId === 100)
                .map(e => (
                  <div className="scoreboard-row">
                    <div className="scoreboard-champion">
                      <div className="scoreboard-champion-icon">
                        <img src={e.champion.iconURL}/>
                      </div>
                      <div className="scoreboard-champion-spells">
                        <img src={e.spell1Id.image}/>
                        <img src={e.spell2Id.image}/>
                      </div>
                      <div className="scoreboard-champion-runes">
                        {
                          e.stats.hasOwnProperty('primaryPerk') ?
                            <img src={e.stats.primaryPerk.slots[0].runes.find(el => el.id === e.stats.perk0).icon}/> : null
                        }
                        {
                          e.stats.hasOwnProperty('secondaryPerk') ?
                            <img src={e.stats.secondaryPerk.icon}/> : null
                        }
                      </div>
                      <div className="scoreboard-summoner">
                        <p>{e.summonerName}</p>
                      </div>
                    </div>
                    <div className="scoreboard-items">
                      {
                        [0, 1, 2, 3, 4, 5, 6].map(el => e.stats[`item${el}`] !== null ?
                          <div className="scoreboard-item">
                            <img src={e.stats[`item${el}`]}/>
                          </div> :
                          <div className="scoreboard-no-item">
                          </div>
                        )
                      }
                    </div>
                    <div className="scoreboard-kda">
                      <p>{e.stats.kills}/{e.stats.deaths}/{e.stats.assists}</p>
                    </div>
                    <div className="scoreboard-dmg">
                      <p>
                        {e.stats.totalDamageDealtToChampions}
                      </p>
                    </div>
                    <div className="scoreboard-gold">
                      <p>
                        {e.stats.goldEarned}
                      </p>
                    </div>
                  </div>
                  )
                )
            }
          </div>
        </div>
        <div className="team-red">
          <div className="scoreboard-header">
            <p>Red team {this.props.allParticipants.filter(e => e.teamId === 200)[0].stats.win ? "(Win)" : "(Loss)"}</p>
            <p>Items</p>
            <p>KDA</p>
            <p>Damage</p>
            <p>Gold</p>
          </div>
          <div className="scoreboard">
            {
              this.props.allParticipants
                .filter(e => e.teamId === 200)
                .map(e => (
                    <div className="scoreboard-row">
                      <div className="scoreboard-champion">
                        <div className="scoreboard-champion-icon">
                          <img src={e.champion.iconURL}/>
                        </div>
                        <div className="scoreboard-champion-spells">
                          <img src={e.spell1Id.image}/>
                          <img src={e.spell2Id.image}/>
                        </div>
                        <div className="scoreboard-champion-runes">
                          {
                            e.stats.hasOwnProperty('primaryPerk') ?
                              <img src={e.stats.primaryPerk.slots[0].runes.find(el => el.id === e.stats.perk0).icon}/> : null
                          }
                          {
                            e.stats.hasOwnProperty('secondaryPerk') ?
                              <img src={e.stats.secondaryPerk.icon}/> : null
                          }
                        </div>
                        <div className="scoreboard-summoner">
                          <p>{e.summonerName}</p>
                        </div>
                      </div>
                      <div className="scoreboard-items">
                        {
                          [0, 1, 2, 3, 4, 5, 6].map(el => e.stats[`item${el}`] !== null ?
                            <div className="scoreboard-item">
                              <img src={e.stats[`item${el}`]}/>
                            </div> :
                            <div className="scoreboard-no-item">
                            </div>
                          )
                        }
                      </div>
                      <div className="scoreboard-kda">
                        <p>{e.stats.kills}/{e.stats.deaths}/{e.stats.assists}</p>
                      </div>
                      <div className="scoreboard-dmg">
                        <p>
                          {e.stats.totalDamageDealtToChampions}
                        </p>
                      </div>
                      <div className="scoreboard-gold">
                        <p>
                          {e.stats.goldEarned}
                        </p>
                      </div>
                    </div>
                  )
                )
            }
          </div>
        </div>
      </div>
    )
  }
}