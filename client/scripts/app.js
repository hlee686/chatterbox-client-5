// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: {},
  init: function() {
    $('p.chat.username').on('click', function(){
      app.addFriend($(this).data('username'));
    });
    $('#send .submit').on('submit', function(){
      console.log("send to handlesubmit");
      app.handleSubmit();
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
        displayMessages(data);
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
  handleSubmit: function(){
    console.log('Just got handled');
  }
};

var displayMessages = function(data) {
  //var msgs = JSON.parse(data);
  var chats = data.results;
  _.each(chats, function(chat){
    // var safeChat = jsesc(chat.text);
    // console.log(safeChat);
    //debugger;
    $('#chats').append('<p class="chat username" data-username="'+chat.username+'">'+chat.username+" : "+
            escapeStr(chat.text)+" : "+ chat.roomname+'</p>');
  });
  console.log(data.results);
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

