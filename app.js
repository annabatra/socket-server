const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(cors());

io.origins(['https://jsramverk.me:443']);

io.on('connection', function (socket) {
    socket.on('user connected', function(user) {
        io.emit('user connected', user)
    })

    socket.on('chat message', function(message) {
        io.emit('chat message', message)
    })
});

server.listen(3100);
