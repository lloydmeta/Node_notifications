NodeJS SocketIO Notifications
--------------------------

Simple user-based notifications. Based on [this guide](http://blog.joshsoftware.com/2012/01/30/push-notifications-using-express-js-and-socket-io/)

0. Clone this repo
1. run `npm install`
2. `node notifications_server.js`
3. Profit

Example client-side code
----------------------

```html
<script src="#{nodejshost}/socket.io/socket.io.js"></script>
<div id="notifications"></div>

<script>
var socket = io.connect('nodejshost');

// Connectivity
socket.emit('user_hash', '<%= current_user.dekagraph_as_id %>');

socket.on('reconnect', function () {
  console.log('Reconnected to the server');
  socket.emit('user_hash', '<%= current_user.dekagraph_as_id %>');
});

socket.on('reconnecting', function () {
  console.log('user_hash', '<%= current_user.dekagraph_as_id %>');
});

// Custom Messages

socket.on('view', function(data) {
  $('#notifications').html("<h1 class='push-notification'>A view was made on your post fool " + data.message + "</h1>");
  $(".push-notification").fadeOut(1500);
});

socket.on('comment', function(data) {
  $('#notifications').html("<h1 class='push-notification'>A comment was made on your post fool " + data.message + "</h1>" );
  $(".push-notification").fadeOut(1500);
});
</script>

```

Copyright
--------
Copyright (c) 2013 Lloyd Chan, released under the MIT license.