const app = require('express')();
const http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('foo')
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});