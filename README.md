NodeJS SocketIO Notifications
--------------------------

Simple user-based notifications. Based on [this guide](http://blog.joshsoftware.com/2012/01/30/push-notifications-using-express-js-and-socket-io/)

0. Clone this repo
1. run `npm install`
2. `node notifications_server.js`
3. Profit

Example server-side code
----------------------

```ruby
module Sender
  mattr_accessor :nodejs_host
  @@nodejs_host = ""

  def self.configure
    yield self if block_given?
  end

  def self.notify(action, user_hash, data)
    url = "#{@@nodejs_host}/notifications/#{action}/#{user_hash}"
    response = Net::HTTP.post_form(URI.parse(URI.encode(url)), data)

    # 200 implies successfully sent.
    # There is nothing we can do if the targe user is not online(404)
    # For any other error, raise Exception
    unless ["200", "404"].include? response.code
      raise NodeNotifier::Exception.new(response.code, response.body)
    end
  end

end

Sender.configure do |config|
  config.nodejs_host = "http://nodjs-server.com"
end

# On comment (e.g. in an observer)
Sender.notify("comment", user.user_hash, {user.notification_count})
```

Example client-side code
----------------------

```html
<script src="#{nodejshost}/socket.io/socket.io.js"></script>
<div id="notifications"></div>

<script>
var socket = io.connect('#{nodejshost}');

// Connectivity
socket.emit('user_hash', '<%= current_user.user_hash %>');

socket.on('reconnect', function () {
  console.log('Reconnected to the server');
  socket.emit('user_hash', '<%= current_user.user_hash %>');
});

socket.on('reconnecting', function () {
  console.log('user_hash', '<%= current_user.user_hash %>');
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