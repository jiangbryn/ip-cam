const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
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
const https_server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/jiangby.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/jiangby.xyz/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/jiangby.xyz/chain.pem'),
}, app);

//const io = socketIO.listen(http_server);//bind socket.io on http server
const io = socketIO.listen(https_server);//bind socket.io on https server


io.on('connection', function (socket) {
    socket.on('join', function (data) {
        socket.join(data.roomId);
        socket.room = data.roomId;
        const sockets = io.of('/').in().adapter.rooms[data.roomId];
        if(sockets.length===1){
            socket.emit('init')
        }else{
            if (sockets.length===2){
                io.to(data.roomId).emit('ready')
            }else{
                socket.room = null
                socket.leave(data.roomId)
                socket.emit('full')
            }

        }
    });
    socket.on('signal', (data) => {
        io.to(data.room).emit('desc', data.desc)
    })
    socket.on('disconnect', () => {
        const roomId = Object.keys(socket.adapter.rooms)[0]
        if (socket.room){
            io.to(socket.room).emit('disconnected')
        }

    })
});

//http_server.listen(port);
https_server.listen(port);

