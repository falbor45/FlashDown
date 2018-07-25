import express from 'express'
import path from 'path';
import fetch from 'node-fetch'
import bodyParser from 'body-parser'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import App from '../app/App.js'
import Html from '../Html'

const API_KEY = '';

const app = express();

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let arr = [];

let summonerSpells;

fetch('http://ddragon.leagueoflegends.com/cdn/8.14.1/data/en_US/summoner.json')
  .then(response => response.json())
  .then(json => {
    summonerSpells = json;
    return null;
  })
  .catch(err => res.send(err));

// encoding function below serves only as an example
let encode = string => {
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    newString += string[i].charCodeAt();
  }
  return newString;
};

// data argument is the data key coming from http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json
let mapSummonerSpellId = (data, spellId) => {
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (parseInt(data[prop].key) === spellId) {
        return {
          name: data[prop].name,
          description: data[prop].description,
          cooldown: parseInt(data[prop].cooldownBurn),
          image: data[prop].image,
          used: new Date().getTime(),
          available: new Date().getTime() + (data[prop].cooldownBurn * 1000)
        }
      }
    }
  }
};

// data argument is the data that comes from gameData variable
let updateSummonerSpellCD = (data, summonerName, spell) => {
  let newData = data;
  let whichSpell = spell === '1' ? 'spell1' : 'spell2';
  for (let i = 0; i < newData.participants.length; i++) {
    if (newData.participants[i].summonerName === summonerName) {
      newData.participants[i][whichSpell].used = new Date().getTime();
      newData.participants[i][whichSpell].available = new Date().getTime() + (newData.participants[i][whichSpell].cooldown * 1000)
    }
  }
  return newData;
};

app.get('/', async (req, res) => {
  const initialState = { };

  ReactDOMServer.renderToNodeStream(
    <Html initialState={JSON.stringify(initialState)}>
    <App {...initialState} />
    </Html>
  ).pipe(res);
});

app.get('/create-watcher/:leagueServer/:summonerName', (req, res) => {
  let leagueServer = req.params.leagueServer;
  let summonerName = req.params.summonerName;
  let summonerId;
  fetch(`https://${leagueServer}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(response => {
      if (arr.includes(response.id)) {
        res.send('Whoops, it looks like this summoner tracker is already up and running!');
        return null;
      }
      summonerId = response.id;
      arr.push(summonerId);
      let gameData;
      fetch(`https://${leagueServer}.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${summonerId}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(json => {
          gameData = {
            mapId: json.mapId,
            gameType: json.gameType,
            gameQueueConfigId: json.gameQueueConfigId,
            participants: json.participants.map(e => {
              return {
                teamId: e.teamId,
                championId: e.championId,
                summonerName: e.summonerName,
                perks: e.perks,
                spell1: mapSummonerSpellId(summonerSpells.data, e.spell1Id),
                spell2: mapSummonerSpellId(summonerSpells.data, e.spell2Id)
              }
            }),
            platformId: json.platformId,
            bannedChampions: json.bannedChampions,
            gameStartTime: json.gameStartTime,
            gameLength: json.gameLength
          }
        })
        .catch(error => res.send(error))

      app.route(`/watchers/${encode(summonerName)}`)
        .get((req, res) => {
          res.send(gameData)
        })
        .post((req, res) => {
          if (req.body.action === 'updateSummonerSpell') {
            gameData = updateSummonerSpellCD(gameData, req.body.summonerName, req.body.spell);
            res.send(`${req.body.summonerName}'s spell has been updated!`)
            return null;
          }
          res.send('No action specified!')
        });
      res.send(`Watcher has been created. Go to /watchers/${encode(summonerName)}`)
    })
    .catch(error => res.send(error))
});

app.listen(3000, function () {
  console.log('listening on *:3000');
});