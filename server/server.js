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
  fetch(`https://${leagueServer}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(response => {
      if (arr.includes(response.id)) {
        res.send('Whoops, it looks like this summoner tracker is already up and running!')
        return null;
      }
      arr.push(response.id);
      app.get(`/watchers/${encode(summonerName)}`, (req, res) => {
        fetch(`https://${leagueServer}.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${response.id}?api_key=${API_KEY}`)
          .then(response => response.json())
          .then(text => res.send(text))
          .catch(error => res.send(error))
      });
      res.send(`Watcher has been created. Go to /watchers/${encode(req.params.summonerName)}`)
    })
    .catch(error => res.send(error))
});

app.listen(3000, function () {
  console.log('listening on *:3000');
});