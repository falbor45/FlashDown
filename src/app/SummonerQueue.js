import React, { Component } from 'react'
import ChallengerLeague from './assets/challenger.png'
import MasterLeague from './assets/master.png'
import DiamondLeague from './assets/diamond.png'
import PlatinumLeague from './assets/platinum.png'
import GoldLeague from './assets/gold.png'
import SilverLeague from './assets/silver.png'
import BronzeLeague from './assets/bronze.png'
import UnrankedLeague from './assets/unranked.png'
import './SummonerQueue.css'

export default class SummonerQueue extends Component {

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

  unrankedLeaguePlaceholder = () => (
    <div className="summoner-queue">
      <img src={`/${UnrankedLeague}`}/>
    </div>
  );

  render() {
    return (
      <div className="summoner-ranked">
        {
          this.props.soloQ !== null ?
            <div className="summoner-queue">
            <img src={`/${this.determineLeagueIcon(this.props.soloQ.tier)}`}/>
            <p className="league-type">{this.determineLeagueType(this.props.soloQ.queueType)}</p>
            <p className="league">
              {this.props.soloQ.tier} {this.props.soloQ.rank}
              <p>{this.props.soloQ.leaguePoints} LP</p>
            </p>
            <p className="league-win-loss">
              Wins: {this.props.soloQ.wins} Losses: {this.props.soloQ.losses}
              <p>Win
                ratio: {Math.floor((this.props.soloQ.wins / (this.props.soloQ.wins + this.props.soloQ.losses)) * 100)}%</p>
            </p>
          </div> : this.unrankedLeaguePlaceholder()
        }
        {
          this.props.flexQ !== null ?
            <div className="summoner-queue">
              <img src={`/${this.determineLeagueIcon(this.props.flexQ.tier)}`}/>
              <p className="league-type">{this.determineLeagueType(this.props.flexQ.queueType)}</p>
              <p className="league">
                {this.props.flexQ.tier} {this.props.flexQ.rank}
                <p>{this.props.flexQ.leaguePoints} LP</p>
              </p>
              <p className="league-win-loss">
                Wins: {this.props.flexQ.wins} Losses: {this.props.flexQ.losses}
                <p>Win
                  ratio: {Math.floor((this.props.flexQ.wins / (this.props.flexQ.wins + this.props.flexQ.losses)) * 100)}%</p>
              </p>
            </div> : this.unrankedLeaguePlaceholder()
        }
        {
          this.props.flex3 !== null ?
            <div className="summoner-queue">
            <img src={`/${this.determineLeagueIcon(this.props.flex3.tier)}`}/>
            <p className="league-type">{this.determineLeagueType(this.props.flex3.queueType)}</p>
            <p className="league">
              {this.props.flex3.tier} {this.props.flex3.rank}
              <p>{this.props.flex3.leaguePoints} LP</p>
            </p>
            <p className="league-win-loss">
              Wins: {this.props.flex3.wins} Losses: {this.props.flex3.losses}
              <p>Win
                ratio: {Math.floor((this.props.flex3.wins / (this.props.flex3.wins + this.props.flex3.losses)) * 100)}%</p>
            </p>
          </div> : this.unrankedLeaguePlaceholder()
        }

      </div>
    )
  }
}