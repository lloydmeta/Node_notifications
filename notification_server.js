require('newrelic');

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , async = require('async');

  var port = process.env.PORT || 8000;

app.use(express.bodyParser());
server.listen(port);

var connections = {}

/********** express.js routes ************/
app.get('/', function (req, res) {
  res.send(404);
});

app.get('/ping', function (req, res) {
  res.send(200);
});

app.post('/notifications/:action/:user_hash', function (req, res) {
  target = connections[req.params.user_hash]
  if (target) {
    user_sockets_array = connections[req.params.user_hash];
    async.forEach(user_sockets_array, function(socket, callback){
      socket.emit(req.params.action, req.body);
      callback();
    }, function(err){
      console.log('Finished');
    });
    res.send(200);
  }
  else
    res.send(404);
});

/********** socket.io work ***************/
io.sockets.on('connection', function(socket) {

  socket.on('user_hash', function(user_hash) {
    if ((connections[user_hash] === undefined) || !(connections[user_hash] instanceof Array))
    {
      console.log("New connection[" + user_hash + "] detected, creating new array");
      connections[user_hash] = [socket];
    }
    else
    {
      if (connections[user_hash].indexOf(user_hash) == -1)
        {
          console.log("Adding socket to connection[" + user_hash + "]");
          connections[user_hash].push(socket);
        }
    }
    socket.set('user_hash', user_hash, function(){});
  });

  socket.on('disconnect', function(){
    socket.get('user_hash', function(error, user_hash){
      var index_of_socket = connections[user_hash].indexOf(socket);
      console.log(user_hash + " disconnected.");
      connections[user_hash].splice(index_of_socket, 1);
      if (connections[user_hash].length == 0){
        console.log("No more connections for " + user_hash + ". Deleting connection object.");
        delete connections[user_hash];
      }
    })
  });

});