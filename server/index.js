const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

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

let offerSocket = null;
let onConnectNum = 0;
let socketsLength = 0;
let imgIndex = 0;

io.on('connection', function (socket) {
  socket.on('join', function (data) {
    socket.join(data.roomId);
    socket.room = data.roomId;
    socketsLength = io.of('/').in().adapter.rooms[data.roomId].length;
    if (socketsLength === 1){
      console.log(`init: room ${data.roomId} is initiated by ${socket.id}`)
    } else {
      if (socketsLength >= 2){
        io.to(data.roomId).emit('ready')
        console.log(`ready: there are ${socketsLength} peers`)
      }
    }
  })

  socket.on('on-connect', () => {
    if (offerSocket === null) {
      offerSocket = socket.id
      io.to(socket.id).emit('on-connect', {initiator: true})
      socket.to(socket.room).emit('app-to-connect')
      console.log(`on-connect: ${socket.id} is the caller`)
    } else {
      io.to(socket.id).emit('on-connect', {initiator: false})
      console.log(`connect: ${socket.id} is the callee`)
    }
    onConnectNum++
    console.log(`on-connect: onConnectNum is ${onConnectNum}/${socketsLength}`)
    if (onConnectNum === socketsLength) {
      socket.to(socket.room).emit('established')
      console.log('established')
    }
  })

  socket.on('offer-or-answer', (data) => {
    socket.to(socket.room).emit('offer-or-answer', data)
    console.log(`offer-or-answer: an ${data.type} is sent by ${socket.id}`)
  })

  socket.on('candidate', (data) => {
    socket.to(socket.room).emit('candidate', data)
    console.log(`candidate: a candidate is sent by ${socket.id}`)
  })

  socket.on('close', () => {
    socket.to(socket.room).emit('close')
    offerSocket = null;
    onConnectNum = 0;
    console.log(`close: offer socket is ${offerSocket}`)
  })

  socket.on('setting', (data) => {
    socket.to(socket.room).emit('receive-setting', data)
    console.log(`setting: ${data}`)
  })

  socket.on('take-photo', () => {
    socket.to(socket.room).emit('take-photo')
    console.log('take-photo')
  })

  socket.on('upload', (data) => {
    const base64Data = data.base64;
    let dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(`../${imgIndex}.png`, dataBuffer, function(err) {
      if(err){
        console.log(`save img failed: ${err}`)
      }else{
        console.log(`img saved`)
      }
    });
  })

  socket.on('disconnect', () => {
    // const roomId = Object.keys(socket.adapter.rooms)[0]
    if (socket.room){
      io.to(socket.room).emit('disconnected')
    }
    onConnectNum = 0;
    offerSocket = null;
    console.log('disconnect')
  })
});


