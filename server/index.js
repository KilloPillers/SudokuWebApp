const express = require('express');
const cors = require('cors')
const {readFileSync} = require('fs')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

app.use(cors())


let puzzles = readFileSync("smallsudoku.txt", 'utf-8').split('\n')

const rooms = {}

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get

//puzzles[Math.floor(Math.random()*puzzles.length)]

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id)
    socket.on("sudoku_change", (sudoku_data, value) => {
        //console.log("Sudoku: ", sudoku_data,  " ", socketID)
        socket.broadcast.emit("sudoku_change", sudoku_data, value)
    })
    socket.emit("user_connecting", puzzles[Math.floor(Math.random()*puzzles.length)])
    socket.on("room-created", (data)=>{
        console.log(data.roomName)
    })
})

//io.emit("user_connecting", puzzles[Math.floor(Math.random()*puzzles.length)])

server.listen(3000, () => {
  console.log('listening on *:3000');
});