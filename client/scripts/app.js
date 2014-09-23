// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: {},
  chats: [],
  rooms: [],

  init: function() {
    $('p.chat').on('click', function(){
      app.addFriend($(this).data('username'));
    });
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.refresh();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {'order': '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        app.getRooms(data.results);
        app.displayMessages(data.results);
        app.init();
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message');
      }
    });
  },


  addFriend: function(username) {
    console.log(this);
    //app.friends[username] = true;
  },

  handleSubmit: function(username, message){
    var data = {
      'username': username,
      'text': message,
      'roomname': '5chan'
    };

    app.send(data);
  },

  displayMessages: function(chats) {
    _.each(chats, function(chat){
      app.chats.push(chat);
      $('#chats').append('<p class="chat" data-username="'+chat.username+'"><a href="#">'+chat.username+"</a>: "+app.escapeStr(chat.text)+": "+ chat.roomname+'</p>');
    });
  },

  refresh: function(){
    //removes event listeners from messages and rooms
    //reset rooms array
    //fetches new messages
    app.removeListeners();
    $('p.chat').remove();
    $('.roomSelect p').remove();
    app.chats = [];
    app.rooms = [];
    app.fetch();
  },

  removeListeners: function() {
    $('p.chat').off('click');
    $('.roomSelect p').off('click');
  },

  escapeStr: function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
      $('.roomSelect').append('<p data-roomname="'+roomArray[i]+'" href="#">'+roomArray[i]+'</p>');
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
    app.displayMessages(filteredChats);
  },
};

$('button.refresh').on('click', function(){
  app.refresh();
});

$('#send .submit').on('click', function(event){
  app.handleSubmit($('#username').val(), $('#message').val());
});


app.fetch();

