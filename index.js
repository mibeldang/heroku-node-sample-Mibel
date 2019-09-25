
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
    console.log(msg)
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});



//listen on every connection
io.on('connection', (socket) => {
  console.log('New user connected')

  //listen on change_username
  socket.on('change_username', (data) => {
    socket.username = data.username
    console.log(socket.username)
  })

  socket.on('log_in', (data) => {
    io.sockets.emit('log_in', data);
  })

  socket.on('request_user', (data) => {
    io.sockets.emit('request_user', data);
  })

  //listen on new_message
  socket.on('new_message', (data) => {
    //broadcast the new message
    io.sockets.emit('new_message', data);
  })

  //listen on typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  })

  socket.on('disconnect' , () => {
    socket.broadcast.emit('user left', socket.username);
  });

})