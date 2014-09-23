// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: {},

  init: function() {
    $('#send .submit').on('click', function(event){
      app.handleSubmit($('#message').val());
    });
    $('p.chat').on('click', function(){
      app.addFriend($(this).data('username'));
    });
    $('button.refresh').on('click', function(){
      app.refresh();
    });
  },

  send: function(message) {
    $.ajax({
    // always use this url
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
    $.ajax({
    // always use this url
      url: app.server,
      type: 'GET',
      data: 'jsonp',
      contentType: 'application/json',
      success: function (data) {
        console.log('Retrieved messages.');
        console.log(data.results);
        app.displayMessages(data.results);
        app.init();
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
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
    var data = {};
    data.text = message;
    data.username = "jgladch";
    data.roomname = "lobby";
    console.log(data);
    app.send(data);
  },

  displayMessages: function(data) {
    _.each(data, function(chat){
      // var safeChat = jsesc(chat.text);
      // console.log(safeChat);
      //debugger;
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


var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

var escapeStr = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

app.fetch();

