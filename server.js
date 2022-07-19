var express = require('express');
var app = express();
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors');

app.use((req, res, next) => {
      res.header("Cross-Origin-Embedder-Policy", "require-corp");
      res.header("Cross-Origin-Opener-Policy", "same-origin");
      next();
    });
app.use(cors({
    origin: 'https://www.section.io'
}));

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(__dirname + '/')); //__dir and not _dir

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/examples/index.html');
});

const PORT = process.env.PORT || 8080;

var games = Array(100);
for (let i = 0; i < 100; i++) {
    games[i] = {players: 0 , roomNumber:0,pid: [0 , 0]};
}

var playerId = Math.floor((Math.random() * 100) + 1)

io.on('connection', function (socket) {
    // console.log(players);
    var color;
    var playerId =  Math.floor((Math.random() * 100) + 1)
    

    console.log(playerId + ' connected');

    socket.on('joined', function (msg) {
        // games[roomId] = {}
        const roomId = msg.roomID;
        const playerName = msg.playerName;
        
        if (games[roomId].players < 2) {
            games[roomId].players++;
            games[roomId].pid[games[roomId].players - 1] = playerId;
        }
        else{
            socket.emit('full', roomId)
            return;
        }
        
        console.log(games[roomId]);
        players = games[roomId].players
        

        if (players == 1) {
            color = 'black';}
        else {color = 'white';}

        socket.emit('player', { playerId, players, color, roomId, playerName})
        // players--;

        
    });

    socket.on('gameOver', function(msg) {
        socket.broadcast.emit('move', msg);
    });
    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
        // console.log(msg);
    });

    socket.on('play', function (msg) {
        socket.broadcast.emit('play', msg);
        console.log("ready " + msg);
    });

    socket.on('disconnect', function () {
        for (let i = 0; i < 100; i++) {
            if (games[i].pid[0] == playerId || games[i].pid[1] == playerId)
                games[i].players--;
        }
        console.log(playerId + ' disconnected');

    });

    
});
server.listen(PORT);
console.log('server on' + PORT);
