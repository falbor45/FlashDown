import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import SummonerStats from './SummonerStats'
import LiveGame from './LiveGame'
import './App.css'

export default class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/summoner/:leagueServer/:summonerName" component={SummonerStats}/>
          <Route path="/gamerooms/:roomCode" component={LiveGame}/>
        </Switch>
      </div>
    );
  }
}