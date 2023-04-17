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

    socket.on("sudoku-change", (roomId, selected, value) => {
        //console.log("Sudoku: ", sudoku_data,  " ", socketID)
        console.log(selected, value)
        rooms[roomId].unsolvedPuzzle[selected] = value
        socket.to(roomId).emit("sudoku-change", selected, value)
    })

    //socket.emit("user_connecting", puzzles[Math.floor(Math.random()*puzzles.length)])

    socket.on("join-room", (roomId)=>{
      socket.join(roomId);
      console.log(`Client joined room ${roomId}`);
      socket.emit("room-data", rooms[roomId]);//see if you could do this with an express endpoint and a response redirect
    })

    socket.on("leave-room", (roomId)=>{
      socket.leave(roomId);
      console.log(`Client left room ${roomId}`);
    })

    socket.on("create-room", (roomData) => {
      let RandomSudoku = puzzles[Math.floor(Math.random()*puzzles.length)].split(",");
      let unsolvedSudoku = RandomSudoku[0].split("").map(Number)
      let solvedSudoku = RandomSudoku[1].split("").map(Number)
      // Generate a new room ID
      const roomId = Math.random().toString(36).substr(2, 9);
      // Add the new room to the dictionary of rooms
      rooms[roomId] = {name: roomData.roomName, 
                      unsolvedPuzzle: unsolvedSudoku,
                      solvedPuzzle: solvedSudoku};
      // Notify all clients of the new room's existence
      //io.emit("room created", roomId);
      console.log(`New room created: ${rooms[roomId].roomName} ${rooms[roomId].puzzle}`);
    });

    socket.on("disconnect", ()=>{
      console.log("Client Disconnected");
    })
})

//io.emit("user_connecting", puzzles[Math.floor(Math.random()*puzzles.length)])

server.listen(3000, () => {
  console.log('listening on *:3000');
});