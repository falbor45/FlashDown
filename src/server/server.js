import express from 'express'
import cors from 'cors'
import path from 'path';
import 'fetch-everywhere'
import bodyParser from 'body-parser'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import streamString from 'node-stream-string'
import RoomManager from './RoomManager'

import App from '../app/App.js'
import Html from '../Html'

const API_KEY = '';

const app = express();
app.use(express.static(path.join(__dirname)));

const api = express();
api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json());

app.use(cors());
api.use(cors());

let rooms = new RoomManager();

let summonerSpells;
let champions;
let latestVersion;
let runesReforged;

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

    fetch(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/runesReforged.json`)
      .then(response => response.json())
      .then(json => {
        runesReforged = json;
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
let mapSummonerSpellId = (data, spellId, gameWatcher, cosmicInsight) => {
  let cooldownMultiplier = cosmicInsight ? 0.95 : 1;
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (parseInt(data[prop].key) === spellId) {
        if (gameWatcher) {
          return {
            name: data[prop].name,
            description: data[prop].description,
            cooldown: parseInt(data[prop].cooldownBurn),
            image: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${data[prop].image.full}`,
            used: new Date().getTime(),
            available: new Date().getTime()
          }
        }
        return {
          name: data[prop].name,
          description: data[prop].description,
          image: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${data[prop].image.full}`
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
          iconURL: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${data[prop].image.full}`
        }
      }
    }
  }
  return null;
};

let mapPerkId = (data, perkId) => {
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (parseInt(data[prop].id) === perkId) {
        return {
          ...data[prop],
          icon: `https://ddragon.leagueoflegends.com/cdn/img/${data[prop].icon}`,
          slots: data[prop].slots.map(e => {
            return {
              runes: e.runes.map(e => {
                return {
                  ...e,
                  icon: `https://ddragon.leagueoflegends.com/cdn/img/${e.icon}`
                }
              })
            }
          })
        }
      }
    }
  }
};

let mapMatch = data => {
  let match = data;
  let findItemIconPath = itemId => itemId !== 0 ? `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${itemId}.png` : null

  match.participants = match.participants.map(e => {
    return {
      champion: mapChampionId(champions.data, e.championId),
      stats: {
        ...e.stats,
        primaryPerk: mapPerkId(runesReforged, e.stats.perkPrimaryStyle),
        secondaryPerk: mapPerkId(runesReforged, e.stats.perkSubStyle),
        item0: findItemIconPath(e.stats.item0),
        item1: findItemIconPath(e.stats.item1),
        item2: findItemIconPath(e.stats.item2),
        item3: findItemIconPath(e.stats.item3),
        item4: findItemIconPath(e.stats.item4),
        item5: findItemIconPath(e.stats.item5),
        item6: findItemIconPath(e.stats.item6)
      },
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
  let cooldownMultiplier = 1;
  let cosmicInsight = false;
  let lucidityBoots = false;
  for (let i = 0; i < newData.participants.length; i++) {
    if (newData.participants[i].summonerName === summonerName) {
      if (newData.participants[i].perks.perkIds.includes(8347)) {
        cosmicInsight = true;
      }
      if (newData.participants[i].lucidityBoots) {
        lucidityBoots = true;
      }
      if (cosmicInsight && lucidityBoots) {
        cooldownMultiplier = 0.85;
      }
      if (cosmicInsight && !lucidityBoots) {
        cooldownMultiplier = 0.95;
      }
      if (!cosmicInsight && lucidityBoots) {
        cooldownMultiplier = 0.9;
      }
      newData.participants[i][whichSpell].used = new Date().getTime();
      newData.participants[i][whichSpell].available = new Date().getTime() + ((newData.participants[i][whichSpell].cooldown * cooldownMultiplier) * 1000)
    }
  }
  return newData;
};

let updateLucidity = (data, summonerName) => {
  let newData = data;
  for (let i = 0; i < newData.participants.length; i++) {
    if (newData.participants[i].summonerName === summonerName) {
      newData.participants[i].lucidityBoots = !newData.participants[i].lucidityBoots;
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

  fetch(encodeURI(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`))
    .then(response => response.json())
    .then(json => {
      console.log('test')
      console.log(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
      console.log(json)
      summonerData.name = json.name;
      summonerData.summonerLevel = json.summonerLevel;
      summonerData.lastSeen = json.revisionDate;
      summonerData.profileIconURL = `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${json.profileIconId}.png`;

      fetch(encodeURI(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/league/v3/positions/by-summoner/${json.id}?api_key=${API_KEY}`))
        .then(response => response.json())
        .then(json2 => {
          summonerData.queueData = json2;

          fetch(encodeURI(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/match/v3/matchlists/by-account/${json.accountId}?endIndex=20&api_key=${API_KEY}`))
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

api.get('/create-game-room/:leagueServer/:summonerName', (req, res) => {
  let leagueServer = req.params.leagueServer;
  let summonerName = req.params.summonerName;
  let summonerId;

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
  fetch(encodeURI(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`))
    .then(response => response.json())
    .then(response => {
      summonerId = response.id;
      let gameData;
      let roomCode;
      fetch(encodeURI(`https://${regionMap[leagueServer]}.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${summonerId}?api_key=${API_KEY}`))
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          res.status(404).send({error_code: 404, message: "Player is currently not in game"})
        })
        .then(json => {
          gameData = {
            mapId: json.mapId,
            gameType: json.gameType,
            gameQueueConfigId: json.gameQueueConfigId,
            participants: json.participants.map(e => {
              return {
                teamId: e.teamId,
                championId: mapChampionId(champions.data, e.championId),
                summonerName: e.summonerName,
                perks: e.perks,
                spell1: mapSummonerSpellId(summonerSpells.data, e.spell1Id, true, e.perks.perkIds.includes(8347), true),
                spell2: mapSummonerSpellId(summonerSpells.data, e.spell2Id, true, e.perks.perkIds.includes(8347), true),
                lucidityBoots: false
              }
            }),
            platformId: json.platformId,
            bannedChampions: json.bannedChampions,
            gameStartTime: json.gameStartTime
          };
          roomCode = rooms.createRoom(gameData);
          res.status(200).send({roomCode: roomCode});
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error))
});

api.route('/gamerooms/:roomCode')
  .get((req, res) => {
    res.send(rooms.getRoom(req.params.roomCode));
  })
  .post((req, res) => {
    if (req.body.action === 'updateSummonerSpell') {
      rooms.rooms[req.body.roomCode] = updateSummonerSpellCD(rooms.rooms[req.body.roomCode], req.body.summonerName, req.body.spell);
      res.send(`${req.body.summonerName}'s spell has been updated!`);
      return null;
    }
    if (req.body.action === 'updateLucidity') {
      rooms.rooms[req.body.roomCode] = updateLucidity(rooms.rooms[req.body.roomCode], req.body.summonerName);
      res.send(`${req.body.summonerName}'s lucidity boots have been updated!`);
      return null;
    }
    res.send('No action specified!')
  });

app.listen(80, function () {
  console.log('listening on *:80');
});

api.listen(3000, function () {
  console.log('listening on *:3000')
});