import express from 'express'
import path from 'path';
import 'fetch-everywhere'
import bodyParser from 'body-parser'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import streamString from 'node-stream-string'

import App from '../app/App.js'
import Html from '../Html'

const API_KEY = '';

const app = express();
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const api = express();
api.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let arr = [];

let summonerSpells;
let champions;
let latestVersion;

fetch('https://ddragon.leagueoflegends.com/api/versions.json')
  .then(response => response.json())
  .then(json => {
    latestVersion = json[0];
    fetch(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/summoner.json`)
      .then(response => response.json())
      .then(json => {
        summonerSpells = json;
        return null;
      })
      .catch(err => console.log(err))

    fetch(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`)
      .then(response => response.json())
      .then(json => {
        champions = json;
        return null;
      })
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err));

// encoding function below serves only as an example
let encode = string => {
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    newString += string[i].charCodeAt();
  }
  return newString;
};

// data argument is the data key coming from http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json
let mapSummonerSpellId = (data, spellId, gameWatcher) => {
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (parseInt(data[prop].key) === spellId) {
        if (gameWatcher) {
          return {
            name: data[prop].name,
            description: data[prop].description,
            cooldown: parseInt(data[prop].cooldownBurn),
            image: data[prop].image,
            used: new Date().getTime(),
            available: new Date().getTime() + (data[prop].cooldownBurn * 1000)
          }
        }
        return {
          name: data[prop].name,
          description: data[prop].description,
          image: data[prop].image
        }
      }
    }
  }
  return null;
};

let mapChampionId = (data, championId) => {
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (parseInt(data[prop].key) === championId) {
        return {
          name: data[prop].name,
          iconURL: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${data[prop].name === 'Wukong' ? 'MonkeyKing' : data[prop].name === 'LeBlanc' ? 'Leblanc' : data[prop].name}.png`
        }
      }
    }
  }
  return null;
};

let mapMatch = data => {
  let match = data;

  match.participants = match.participants.map(e => {
    return {
      champion: mapChampionId(champions.data, e.championId),
      stats: e.stats,
      spell1Id: mapSummonerSpellId(summonerSpells.data, e.spell1Id, false),
      spell2Id: mapSummonerSpellId(summonerSpells.data, e.spell2Id, false),
      timeline: e.timeline,
      teamId: e.teamId,
      participantId: e.participantId
    }
  });

  return match;
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

app.get('*', async (req, res) => {
  const initialState = { };
  const context = {};

  const stream = streamString`
    <!DOCTYPE html>
    ${ReactDOMServer.renderToNodeStream(
    <Html initialState={JSON.stringify(initialState)}>
    <StaticRouter location={req.url} context={context}>
      <App {...initialState} />
    </StaticRouter>
    </Html>
  )}
  `
  stream.pipe(res);
});

api.get('/summoner/:leagueServer/:summonerName', (req, res) => {
  let leagueServer = req.params.leagueServer;
  let summonerName = req.params.summonerName;
  let summonerData = {};

  let regionMap = {
    "eune": "eun1",
    "euw": "euw1",
    "jp": "jp1",
    "las": "la2",
    "lan": "la1",
    "na": "na1",
    "oce": "oc1",
    "ru": "ru",
    "tr": "tr1",
    "br": "br1"
  };

  if (regionMap[leagueServer] === undefined) {
    res.json({
      status: {
        status_code: 404,
        message: "Region not found"
      }
    });

    return null;
  }

  fetch(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(json => {
      summonerData.name = json.name;
      summonerData.summonerLevel = json.summonerLevel;
      summonerData.lastSeen = json.revisionDate;
      summonerData.profileIconURL = `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${json.profileIconId}.png`;

      fetch(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/league/v3/positions/by-summoner/${json.id}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(json2 => {
          summonerData.queueData = json2;

          fetch(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/match/v3/matchlists/by-account/${json.accountId}?endIndex=20&api_key=${API_KEY}`)
            .then(response => response.json())
            .then(async json3 => {
              let matches = [];
              let matchURLs = await json3.matches.map(e => `https://${regionMap[leagueServer]}.api.riotgames.com/lol/match/v3/matches/${e.gameId}?api_key=${API_KEY}`)

              await Promise.all(matchURLs.map(async (matchURL) => {
                return fetch(matchURL)
                  .then(matchData => matchData.json())
                  .then(json => matches.push(mapMatch(json)))
                  .catch(err => console.log(err));
              }));

              summonerData.recentMatches = matches;
            })
            .then(() => res.send(summonerData))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
});

api.get('/create-watcher/:leagueServer/:summonerName', (req, res) => {
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
                spell1: mapSummonerSpellId(summonerSpells.data, e.spell1Id, true),
                spell2: mapSummonerSpellId(summonerSpells.data, e.spell2Id, true)
              }
            }),
            platformId: json.platformId,
            bannedChampions: json.bannedChampions,
            gameStartTime: json.gameStartTime
          }
        })
        .catch(error => res.send(error))

      api.route(`/watchers/${encode(summonerName)}`)
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

app.listen(80, function () {
  console.log('listening on *:80');
});

api.listen(3000, function () {
  console.log('listening on *:3000')
});