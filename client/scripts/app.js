// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: {},
  chats: {},
  rooms: {},
  username: window.location.search.substr(10),

  init: function() {
    
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.displayMessage(app.renderMessage(data));
        app.successMsg();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  successMsg: function(){
    var $message = $('<div>', {class: 'success'}).text('Message Sent!');
    $('body').append($message);
    setTimeout(function(){$('div.success').remove();}, 3000);
  },

  fetch: function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {'order': '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        // app.getRooms(data.results);
        app.processMessages(data.results);
        app.init();
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  processMessages: function(chats) {
    _.each(chats, function(chat){
      if (!app.chats[chat.objectId] && chat.username !== '' && chat.text !== '') {
        if (chat.roomname !== '' && app.rooms[chat.roomname] === undefined) {
          app.rooms[chat.roomname] = true;
        }
        app.chats[chat.objectId] = true;
        var $html = app.renderMessage(chat);
        app.displayMessage($html);
      }
    });
    app.chatListener();
  },

  renderMessage: function(message) {
    var $user = $('<div>', {class: 'user', 'data-username': message.username}).text(message.username);
    var $text = $('<div>', {class: 'user'}).text(message.text);
    var $message = $('<div>', {class: 'chat', 'data-id': message.objectId}).append($user, $text);
    return $message;
  },

  displayMessage: function(renderedMessage) { //iterate through chats, have them rendered & prepend to #chats
    $('#chats').append(renderedMessage);
  },

  addFriend: function(username) {
    console.log(this);
    //app.friends[username] = true;
  },

  formatSend: function(username, message, room){
    var data = {
      'username': username,
      'text': message,
      'roomname': room,
    };
    app.send(data);
  },

  chatListener: function(){
    $('div.chat').on('click', function(){
      app.addFriend($(this).data('username'));
    });
  },

  refresh: function(){
    app.fetch();
  },

  getRooms: function(data){
    var storage = {};
    //iterate through chats and get rooms !== undefined
    for (var i = 0; i < data.length; i++) {
      if (data[i].roomname !== undefined) {
        storage[data[i].roomname] = true;
      }
    }
    for (var key in storage) {
      app.rooms.push(key);
    }

    app.addRoom(app.rooms);
  },

  addRoom: function(roomArray) {
    for (var i = 0; i < roomArray.length; i++) {
      $('.roomSelect').append('<p data-roomname="'+app.escapeStr(roomArray[i])+'" href="#">'+app.escapeStr(roomArray[i])+'</p>');
    }

    $('.roomSelect p').on('click', function(){
      app.filterForRoom($(this).data('roomname'));
    });
  },

  filterForRoom: function(roomname) {
    var filteredChats = [];
    for (var i = 0; i < app.chats.length; i++) {
      if (app.chats[i].roomname === roomname) {
        filteredChats.push(app.chats[i]);
      }
    }
    app.removeListeners();
    $('p.chat').remove();
    app.displayMessage(filteredChats);
  },
};

$('button.refresh').on('click', function(){
  app.refresh();
});

$('#send .submit').on('click', function(event){
  var $message = $('#message').val();
  var $username = $('#username').val();
  var $room = $('#roomname').val();
  app.formatSend($username, $message, $room);
});


app.fetch();

