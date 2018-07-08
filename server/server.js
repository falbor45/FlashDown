const app = require('express')();
const fetch = require('node-fetch');
const API_KEY = '';

app.get('/', function(req, res){
  res.send('foo')
});

app.get('/create-watcher/:leagueServer/:summonerName', (req, res) => {
  fetch(`https://${req.params.leagueServer}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(response => fetch(`https://eun1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${response.id}?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(text => res.send(text))
      .catch(error => res.send(error)))
    .catch(error => res.send(error))
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});