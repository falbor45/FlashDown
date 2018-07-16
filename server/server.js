const app = require('express')();
const fetch = require('node-fetch');
const API_KEY = '';

let arr = [];


// encoding function below serves only as an example
let encode = string => {
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    newString += string[i].charCodeAt();
  }
  return newString;
}

app.get('/', function (req, res) {
  res.send('foo')
});

app.get('/create-watcher/:leagueServer/:summonerName', (req, res) => {
  let leagueServer = req.params.leagueServer;
  let summonerName = req.params.summonerName;
  let summonerId;
  fetch(`https://${leagueServer}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(response => {
      if (arr.includes(response.id)) {
        res.send('Whoops, it looks like this summoner tracker is already up and running!')
        return null;
      }
      summonerId = response.id;
      arr.push(summonerId);
      app.get(`/watchers/${encode(summonerName)}`, (req, res) => {
        fetch(`https://${leagueServer}.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${summonerId}?api_key=${API_KEY}`)
          .then(response => response.json())
          .then(json => res.send({
              mapId: json.mapId,
              gameType: json.gameType,
              gameQueueConfigId: json.gameQueueConfigId,
              participants: json.participants.map(e => {
                return {
                  teamId: e.teamId,
                  championId: e.championId,
                  summonerName: e.summonerName,
                  perks: e.perks,
                  spell1: {
                    id: e.spell1Id,
                    used: new Date().getTime()
                  },
                  spell2: {
                    id: e.spell2Id,
                    used: new Date().getTime()
                  }
                }
              }),
              platformId: json.platformId,
              bannedChampions: json.bannedChampions,
              gameStartTime: json.gameStartTime,
              gameLength: json.gameLength
            }))
          .catch(error => res.send(error))
      });
      res.send(`Watcher has been created. Go to /watchers/${encode(summonerName)}`)
    })
    .catch(error => res.send(error))
});

app.listen(3000, function () {
  console.log('listening on *:3000');
});