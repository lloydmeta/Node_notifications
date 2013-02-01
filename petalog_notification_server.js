var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


app.use(express.bodyParser());
app.listen(13002);

var connections = {}

/********** express.js routes ************/
app.get('/', function (req, res) {
  res.send(404);
});

app.post('/notifications/:action/:to', function (req, res) {
  target = connections[req.params.to]
  if (target) {
    connections[req.params.to].emit(req.params.action, req.body);
    res.send(200);
  }
  else
    res.send(404);
});

/********** socket.io work ***************/
io.sockets.on('connection', function(socket) {
  socket.on('user_hash', function(user_hash) {
    connections[user_hash] = socket;
  });

});