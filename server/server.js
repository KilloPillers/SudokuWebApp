const express = require('express');
const port = 3002
const cors = require('cors')
const {readFileSync} = require('fs')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const bodyParse = require("body-parser");
const { setTimeout } = require('timers');
const io = require("socket.io")(server, {
    cors: {
      origin: "https://onlinesudoku.us/",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

app.use(cors())
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended: false}))

let puzzles = readFileSync("smallsudoku.txt", 'utf-8').split('\n')

const rooms = {}

app.get('/', (req, res) => {
  res.send('<a href="https://youtu.be/7hpFYz45Odg?t=7"> you\'re not supposed to be here</a>');
});

app.get('/data', (req, res) => {
  res.send(rooms)
})

app.get('/joinRoom/:roomId', (req, res) => {
  res.send(rooms[req.params.roomId])
})

app.get('/roomExists/:roomId', (req, res) => {
  if (rooms.hasOwnProperty(req.params.roomId))
    res.send(true)
  else
    res.send(false)
})

app.get('/userData/:roomId', (req, res) => {
  res.send(rooms[req.params.roomId].users)
})

app.post('/createRoom', function(req, res) {
  let RandomSudoku = puzzles[Math.floor(Math.random()*puzzles.length)].split(",");
  let unsolvedSudoku = RandomSudoku[0].split("").map(Number)
  let solvedSudoku = RandomSudoku[1].split("").map(Number)

  // Generate a new room ID
  let roomId = '';
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ'; // excludes the letter 'O'

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters.charAt(randomIndex);
  }

  // Add the new room to the dictionary of rooms
  rooms[roomId] = {time: req.body.startTime,
                  id: roomId,
                  users: {},
                  unsolvedPuzzle: unsolvedSudoku,
                  solvedPuzzle: solvedSudoku};
  
  res.send(JSON.stringify({id: roomId}))
  console.log(`New room created: ${roomId}`)
})

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id)

    socket.on("sudoku-change", (user, roomId, selected, value) => {
        console.log(`${socket.id} in ${roomId} put ${value} at position ${selected}`)
        if (value !== 0)
          if (rooms[roomId].solvedPuzzle[selected] === value)
            rooms[roomId].users[user].correctCount++
          else
            rooms[roomId].users[user].incorrectCount++

        rooms[roomId].unsolvedPuzzle[selected] = value
        socket.broadcast.to(roomId).emit("sudoku-update", selected, value)
    })

    socket.on("message", data => {
      console.log(`sending message to room: ${data.roomId}`)
      io.to(data.roomId).emit("messageResponse", data)
    })

    socket.on("join-room", (userName, roomId)=>{
      if (!rooms.hasOwnProperty(roomId)) {
        console.log(`Socket: ${socket.id} attempted to join room that does not exist`)
        io.to(socket.id).emit("NoRoomFound")
        return
      }
      socket.join(roomId);
      if (!rooms[roomId].users.hasOwnProperty(userName))
        rooms[roomId].users[userName] = {correctCount: 0, incorrectCount: 0}
      console.log(`Socket: ${socket.id} with username: "${userName}" joined room: ${roomId}`);
    })

    socket.on("leave-room", (userName, roomId)=>{
      console.log(`${userName} left room ${roomId}`);
      socket.leave(roomId);
      if (rooms.hasOwnProperty(roomId)) {
        delete rooms[roomId].users[userName]
        if (Object.keys(rooms[roomId].users).length === 0)
          setTimeout(()=>{
            if (Object.keys(rooms[roomId].users).length === 0) {
              console.log(`Closing empty room: ${roomId}`)
              delete rooms[roomId]
            }
          }, 5000) //just in case they come back
      }
    })

    socket.on("disconnect", ()=>{
      console.log("Client Disconnected");
    })
})

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});