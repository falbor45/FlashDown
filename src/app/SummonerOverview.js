import React, { Component } from 'react'
import CircularProgressbar from 'react-circular-progressbar';
import './SummonerOverview.css'

export default class SummonerOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mostPlayedChampions: this.findMostPlayedChampions(),
      gamesPlayed: this.props.recentMatches.length,
      gamesWon: this.props.recentMatches.filter(e => e.searchedSummoner.stats.win).length
    }
  }

  findMostPlayedChampions = () => {
    let mostPlayedChampions = [];
    let playedChampions = {};

    this.props.recentMatches.forEach(e => {
      let championName = e.searchedSummoner.champion.name;
      if (!playedChampions[championName]) {
        playedChampions[championName] = {
          name: championName,
          iconURL: e.searchedSummoner.champion.iconURL,
          games: 1,
          wins: e.searchedSummoner.stats.win ? 1 : 0,
          kills: e.searchedSummoner.stats.kills,
          deaths: e.searchedSummoner.stats.deaths,
          assists: e.searchedSummoner.stats.assists,
          creepScore: e.searchedSummoner.stats.totalMinionsKilled + e.searchedSummoner.stats.neutralMinionsKilled,
          totalGamesLength: e.gameDuration
        };
        return null;
      }
      playedChampions[championName].games++;
      playedChampions[championName].wins += e.searchedSummoner.stats.win ? 1 : 0;
      playedChampions[championName].kills += e.searchedSummoner.stats.kills;
      playedChampions[championName].deaths += e.searchedSummoner.stats.deaths;
      playedChampions[championName].assists += e.searchedSummoner.stats.assists;
      playedChampions[championName].creepScore += (e.searchedSummoner.stats.totalMinionsKilled + e.searchedSummoner.stats.neutralMinionsKilled);
      playedChampions[championName].totalGamesLength += e.gameDuration;
    });

    let mostPlayedChampionsKeys = Object.keys(playedChampions).sort((a, b) => playedChampions[b].games - playedChampions[a].games);

    mostPlayedChampionsKeys.forEach(e => mostPlayedChampions.push(playedChampions[e]));

    return mostPlayedChampions;
  };

  render() {
    return (
      <div className="summoner-overview">
        <div className="recent-matches">
          <p className="recent-matches-title">Recent matches</p>
          <p className="games-played">{this.state.gamesPlayed}G {this.state.gamesWon}W {this.state.gamesPlayed - this.state.gamesWon}L</p>
          <div className="progress-bar-wrapper">
            <CircularProgressbar percentage={(this.state.gamesWon / this.state.gamesPlayed) * 100}
                                 text={`${Math.round((this.state.gamesWon / this.state.gamesPlayed) * 100)}%`}
                                 strokeWidth={16}
                                 styles={{
                                   text: {
                                     fill: '#fff',
                                     dominantBaseline: 'middle',
                                     textAnchor: 'middle',
                                     fontSize: '1rem'
                                   },
                                   path: {
                                     stroke: '#0381FF'
                                   },
                                   trail: {
                                     stroke: '#FF6F00'
                                   }
                                 }}/>
          </div>
        </div>
        <div className="most-played-champions">
          {
            this.state.mostPlayedChampions.map(e => (
              <div className="played-champion">
                <div className="champion-icon">
                  <img src={e.iconURL}/>
                </div>
                <div className="champion-creeps">
                  <p>{e.name}</p>
                  <p>CS {(e.creepScore / e.games).toFixed(1)} ({((e.creepScore / e.totalGamesLength * 60)).toFixed(1)})</p>
                </div>
                <div className="champion-kda">
                  <p>{((e.kills + e.assists) / e.deaths).toFixed(2)} KDA</p>
                  <p>{(e.kills / e.games).toFixed(1)}/{(e.deaths / e.games).toFixed(1)}/{(e.assists / e.games).toFixed(1)}</p>
                </div>
                <div className="champion-wr">
                  <p>{Math.round((e.wins / e.games) * 100)}%</p>
                  <p>{e.games} games</p>
                </div>
              </div>
              )
            )
          }
        </div>
      </div>
    )
  }
}