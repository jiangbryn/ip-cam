const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();

const port = 3000;
const filePath = path.resolve(__dirname, '../client/dist');

app.use(cors());

app.use('/static', express.static(filePath));  //static file
app.get('/ip-cam', function (request, response){
    response.sendFile(path.resolve(filePath, 'index.html'))
});

const http_server = http.createServer(app);

const io = socketIO.listen(http_server);//bind socket.io on http server

http_server.listen(port, '0.0.0.0');

io.on('connection', function (socket) {
  socket.on('join', function (data) {
    socket.join(data.roomId);
    socket.room = data.roomId;
    const sockets = io.of('/').in().adapter.rooms[data.roomId];
    if (sockets.length === 1){
      socket.emit('init')
      console.log('init')
    } else {
      if (sockets.length >= 2){
        io.to(data.roomId).emit('ready')
        console.log('ready')
      }
    }
  })

  socket.on('offerOrAnswer', (data) => {
    io.to(socket.room).emit('offerOrAnswer', data)
    console.log('offerOrAnswer:')
    console.log(data.type)
  })

  socket.on('candidate', (data) => {
    io.to(socket.room).emit('candidate', data)
    console.log('candidate')
  })

  socket.on('setting', (data) => {
    io.to(socket.room).emit('receiveSetting', data)
    console.log('setting:')
    console.log(data)
  })

  socket.on('disconnect', () => {
    // const roomId = Object.keys(socket.adapter.rooms)[0]
    if (socket.room){
      io.to(socket.room).emit('disconnected')
    }
    console.log('disconnect')
  })
});


