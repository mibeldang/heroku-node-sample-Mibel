

var myName = "";
var users = [""];
$(document).ready(function () {
  var socket = io.connect('http://localhost:3000')
  socket.emit("request_user", "REQUEST");
  var message = $("#message");
  var username = $("#username");
  var btnMessage = $("#btnMessage");
  var btnUsername = $("#btnUsername");
  var inbox = $("#inbox");
  var feedback = $("#feedback");
  var interval = 0;

  //If username is saved
  $(document).delegate('#btnUsername', 'click', function (e) {
    myName = $('#username').val();
    if (myName != "" && !users.includes(myName)) {
      users.push(myName);
      socket.emit("log_in", myName);
      $(this).closest('.modal').removeClass('active');
      e.preventDefault();
      inbox.append("<i>You joined the group<br><i>");
    } else {
      alert("Username already used!!!");
    }
  });

  socket.on('request_user', function (user) {
    socket.emit("log_in", myName);
  })

  socket.on('log_in', function (user) {
    if (!users.includes(user)) {
      users.push(user);
      $('#users').append('<p> 🔵 <i>' + user + '</p>');
      inbox.append("<i>" +user + " joined the group<i><br>");
    }
  })

  //Emit message
  btnMessage.click(function () {
    socket.emit('new_message', { username: myName, message: $('#message').val() });
    message.val('');
  });

  //Listen on new_message
  socket.on("new_message", (data) => {
    feedback.html('');
    if (data.username == myName) {
      inbox.append("<h4 style='color: black; margin-top:-10px' id='ownMessage'>" 
      + data.message + "</h4><br><p style='color:black' id='ownMessageTime'>" +
       moment().format('MMM Do YYYY, h:mm:ss a') + '</p>')
    } else {
      inbox.append("<h4 style='color: blue; margin-top:-10px' id='othersMessage'><b>" + 
      data.username + ":</b>   " + data.message + "</h4><br><p style='color:green' id='otherMessageTime'>" +
       moment().format('MMM Do YYYY, h:mm:ss a') + '</p>')
    }
    $("#inbox").scrollTop($("#inbox")[0].scrollHeight);
  })

  //Emit a username
  btnUsername.click(function () {
    socket.emit('change_username', { username: username.val() })
  })

  //Emit typing
  message.on("keydown", () => {
    socket.emit('typing', myName)
  })

  //Listen on typing
  socket.on('typing', (data) => {
    clearInterval(interval);
    feedback.html("<p><i>" + data + " is typing a message..." + "</i></p>");
    interval = setInterval(function () {
      feedback.html('');
    }, 2000);
  })
});