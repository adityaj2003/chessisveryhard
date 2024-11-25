var express = require('express');
var app = express();
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors');
const mime = require('mime');
const { Pool } = require('pg');


const pool = new Pool({
    host: 'database-1.cbxymylid2b5.us-west-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'Um5WmIrjCJq8IGAefQ1l',
    database: 'postgres',
    PORT: 5432,
  });

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
app.use(cors({
    origin: '*'
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

io.on('connection', function (socket) {
    var color;
    var playerId =  Math.floor((Math.random() * 100) + 1);
    socket.on('joined', function (msg) {
        const roomID = msg.roomID;
        const playerName = msg.playerName;
        
        if (games[roomID].players < 2) {
            games[roomID].players++;
            games[roomID].pid[games[roomID].players - 1] = playerId;
            socket.join(roomID);
        }
        else{
            socket.emit('full', roomID)
            return;
        }
        
        players = games[roomID].players

        if (players == 1) {
            color = 'black';
        } else {
            color = 'white';
        }
        socket.emit('player', { playerId, players, color, roomID, playerName})
    });

    socket.on('gameOver', function(msg) {
        // Emit this message to the room
        io.to(msg.roomID).emit('gameOver', msg);
    });
    
    socket.on('move', function (msg) {
        // Emit this message to the room
        io.to(msg.roomID).emit('move', msg);
    });

    socket.on('play', function (msg) {
        console.log(`Emitting play event ${msg})`);
        io.to(msg).emit('play', msg);

    });

    socket.on('disconnect', function () {
        for (let i = 0; i < 100; i++) {
            if (games[i].pid[0] == playerId || games[i].pid[1] == playerId)
                games[i].players--;
        }
    });

    socket.on('getPuzzle', function () {
        const query = 'SELECT * FROM puzzles ORDER BY RANDOM() LIMIT 1';
    
        pool.query(query, (err, result) => {
        if (err) {
            socket.emit('puzzleData', null);
            return;
        }
        if (result.rows.length > 0) {
            const puzzleData = result.rows[0]; 
            const puzzleId = puzzleData.puzzleId;
            const fen = puzzleData.fen;
            const moves = puzzleData.moves;
            const event = puzzleData.event;
            const white = puzzleData.white;
            const black = puzzleData.black;


            const puzzleJSON = {
            puzzleId,
            fen,
            moves,
            event,
            white,
            black
            };

            socket.emit('puzzleData', JSON.stringify(puzzleJSON));
        } else {
            socket.emit('puzzleData', null);
        }
        });


});

});


server.listen(PORT);
console.log('server on ' + PORT);