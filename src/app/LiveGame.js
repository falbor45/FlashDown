import React, {Component} from 'react';
import './LiveGame.css'
import lucidityBoots from './assets/lucidityBoots.png'
import {determineQueueType} from './Helpers';

export default class LiveGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      currentTime: setInterval(() => this.setState({
        currentTime: new Date().getTime()
      }))
    };
  }

  fetchRoom = () => {
    fetch(`http://${window.location.host}:3000/gamerooms/${this.props.match.params.roomCode}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json
        })
      });
  };

  flashDown = (action, summonerName, spell = null) => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        summonerName: summonerName,
        spell: spell,
        roomCode: this.props.match.params.roomCode
      })
    };


    fetch(`http://${window.location.host}:3000/gamerooms/${this.props.match.params.roomCode}`, options)
      .then(() => this.fetchRoom());
    return null;
  };

  componentDidMount() {
    this.fetchRoom();
    setInterval(() => {
      this.fetchRoom();
    }, 2000);
  }

  render() {
    return (
      this.state.data !== null ?
        <div className="live-game-container">
          <div className="live-game-header">
            <p>{determineQueueType(this.state.data.gameQueueConfigId)}</p>
            <p>Room: {this.props.match.params.roomCode}</p>
            <div className="live-game-participants">
              <div className="team-blue">
                {
                  this.state.data.participants
                    .filter(e => e.teamId === 100)
                    .map(e => (
                      <div>
                        <div className="live-game-summoner-name">
                          <p>{e.summonerName}</p>
                          <img onClick={() => this.flashDown('updateLucidity', e.summonerName)} className={`live-game-boots ${!e.lucidityBoots ? "on-cooldown" : null}`} src={`/${lucidityBoots}`}/>
                        </div>
                        <div className="live-game-champion">
                          <img src={e.championId.iconURL}/>
                        </div>
                        <div className="live-game-spells">
                          <div onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '1')}>
                            <img className={this.state.currentTime < e.spell1.available ? 'on-cooldown' : null} src={e.spell1.image}/>
                            <span onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '1')}>{e.spell1.available - this.state.currentTime > 0 ? Math.floor((e.spell1.available - this.state.currentTime) / 1000) : null}</span>
                          </div>
                          <div onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '2')}>
                            <img className={this.state.currentTime < e.spell2.available ? 'on-cooldown' : null} src={e.spell2.image}/>
                            <span onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '2')}>{e.spell2.available - this.state.currentTime > 0 ? Math.floor((e.spell2.available - this.state.currentTime) / 1000) : null}</span>
                          </div>
                        </div>
                      </div>
                    ))
                }
              </div>
              <div className="team-red">
                {
                  this.state.data.participants
                    .filter(e => e.teamId === 200)
                    .map(e => (
                      <div>
                        <div className="live-game-spells">
                          <div onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '1')}>
                            <img className={this.state.currentTime < e.spell1.available ? 'on-cooldown' : null} src={e.spell1.image}/>
                            <span onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '1')}>{e.spell1.available - this.state.currentTime > 0 ? Math.floor((e.spell1.available - this.state.currentTime) / 1000) : null}</span>
                          </div>
                          <div onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '2')}>
                            <img className={this.state.currentTime < e.spell2.available ? 'on-cooldown' : null} src={e.spell2.image}/>
                            <span onClick={() => this.flashDown('updateSummonerSpell', e.summonerName, '2')}>{e.spell2.available - this.state.currentTime > 0 ? Math.floor((e.spell2.available - this.state.currentTime) / 1000) : null}</span>
                          </div>
                        </div>
                        <div className="live-game-champion">
                          <img src={e.championId.iconURL}/>
                        </div>
                        <div className="live-game-summoner-name">
                          <img onClick={() => this.flashDown('updateLucidity', e.summonerName)} className={`live-game-boots ${!e.lucidityBoots ? "on-cooldown" : null}`} src={`/${lucidityBoots}`}/>
                          <p>{e.summonerName}</p>
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        </div> : <div>Loading</div>
    )
  }
}