const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const db_chat = require('./db/db.js');
const db_setup = require('./db/setup.js');
const dsn = "mongodb://localhost:27017/chat";


app.use(cors());

io.origins(['https://jsramverk.me:443']);

io.on('connection', function (socket) {
    socket.on('user connected', function(user) {
        io.emit('user connected', user)
    })

    socket.on('chat message', function(message) {
        io.emit('chat message', message)
        db_chat.addToChatDB(dsn, "savedmessages", message);
    })

    socket.on('get history', function() {
        (() => {
            db_chat.findAllCollection(dsn, "savedmessages", 100)
            .then(res => io.emit('get history', res))
            .catch(err => console.log(err));
        })();
    })

    socket.on('clear chat', function() {
        db_setup.resetCollection(dsn, "savedmessages")
        io.emit('clear chat');
    })
});

server.listen(3100);
