// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: {},

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
        console.log(data);
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
        console.log('Retrieved messages.');
        app.displayMessages(data.results);
        app.init();
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  clearMessages: function(){
    $('#chats').children().remove();
  },

  addMessage: function(message) {
    $('#chats').append('<p class="chat username" data-username="'+message.username+'">'+message.username+" : "+
            escapeStr(message.text)+" : "+ message.roomname+'</p>');
  },

  addRoom: function(roomName) {
    $('#roomSelect').append('<div class="'+roomName+'">'+roomName+'</div>');
  },

  addFriend: function(username) {
    console.log(this);
    //app.friends[username] = true;
  },

  handleSubmit: function(message){
    var data = {
      'username': 'jgladch',
      'text': message,
      'roomname': '5chan'
    };

    app.send(data);
  },

  displayMessages: function(data) {
    _.each(data, function(chat){
      $('#chats').append('<p class="chat" data-username="'+chat.username+'">'+chat.username+": "+escapeStr(chat.text)+": "+ chat.roomname+'</p>');
    });
    console.log(data.results);
  },

  refresh: function(){
    $('p.chat').off('click');
    $('p.chat').remove();
    app.fetch();
  }
};

var escapeStr = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

$('button.refresh').on('click', function(){
  app.refresh();
});

$('#send .submit').on('click', function(event){
  app.handleSubmit($('#message').val());
});

app.fetch();

