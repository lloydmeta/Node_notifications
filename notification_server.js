var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


app.use(express.bodyParser());
server.listen(8000);

var connections = {}

/********** express.js routes ************/
app.get('/', function (req, res) {
  res.send(404);
});

app.post('/notifications/:action/:user_hash', function (req, res) {
  target = connections[req.params.user_hash]
  if (target) {
    user_sockets_array = connections[req.params.user_hash];
    for (var i=0; i < user_sockets_array.length; i++){
      console.log("Sending notification to " + user_sockets_array[i].id);
      user_sockets_array[i].emit(req.params.action, req.body);
    }
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
      console.log("New connection[" + user_hash + "] detected, creating new array")
      connections[user_hash] = [socket];
    }
    else
    {
      if (connections[user_hash].indexOf(user_hash) == -1)
        {
          console.log("Adding socket to connection[" + user_hash + "]")
          connections[user_hash].push(socket);
        }
    }
    socket.set('user_hash', user_hash, function(){});
  });

  socket.on('disconnect', function(){
    socket.get('user_hash', function(error, user_hash){
      var index_of_socket = connections[user_hash].indexOf(socket);
      console.log(user_hash + " disconnected.")
      connections[user_hash].splice(index_of_socket, 1);
      if (connections[user_hash].length == 0){
        console.log("No more connections for " + user_hash + ". Deleting connection object.")
        delete connections[user_hash];
      }
    })
  });


});