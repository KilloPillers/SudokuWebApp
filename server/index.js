const express = require('express');
const cors = require('cors')
const {readFileSync} = require('fs')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const bodyParse = require("body-parser")
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3001",
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
  res.send('<h1>Hello world</h1>');
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

app.post('/createRoom', function(req, res) {
  let RandomSudoku = puzzles[Math.floor(Math.random()*puzzles.length)].split(",");
  let unsolvedSudoku = RandomSudoku[0].split("").map(Number)
  let solvedSudoku = RandomSudoku[1].split("").map(Number)
  // Generate a new room ID
  let roomId = Math.random().toString(36).toUpperCase().replace(/[0-9O]/g, '').substring(1,7)
  //console.log(req)
  // Add the new room to the dictionary of rooms
  rooms[roomId] = {time: req.body.startTime,
                  id: roomId, 
                  unsolvedPuzzle: unsolvedSudoku,
                  solvedPuzzle: solvedSudoku};

  //console.log(`New room created: \n name: ${rooms[roomId].name} \n id: ${rooms[roomId].id}\n 
  //             unsolvedPuzzle: ${rooms[roomId].unsolvedPuzzle}\n solvedPuzzle: ${rooms[roomId].solvedPuzzle}`);
  res.send(JSON.stringify({id: roomId}))
})

//puzzles[Math.floor(Math.random()*puzzles.length)]

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id)

    socket.on("game-over", (roomId) => {


    }) 

    socket.on("sudoku-change", (user, roomId, selected, value) => {
        //console.log("Sudoku: ", sudoku_data,  " ", socketID)
        console.log(user, roomId, selected, value)


        rooms[roomId].unsolvedPuzzle[selected] = value
        socket.to(roomId).emit("sudoku-update", selected, value)
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
      socket.leaveAll();
      socket.join(roomId);
      console.log(`Socket: ${socket.id} with username: "${userName}" joined room: ${roomId}`);
      io.to(socket.id).emit("room-data", rooms[roomId]);//see if you could do this with an express endpoint
    })

    socket.on("leave-room", (roomId)=>{
      socket.leave(roomId);
      console.log(`Client left room ${roomId}`);
    })

    socket.on("create-room", (roomData) => {
      socket.leaveAll();
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
      console.log(`New room created: ${roomId} - ${rooms[roomId].name} | ${rooms[roomId].unsolvedPuzzle}`);
    });

    socket.on("disconnect", ()=>{
      console.log("Client Disconnected");
    })
})

//io.emit("user_connecting", puzzles[Math.floor(Math.random()*puzzles.length)])

server.listen(3000, () => {
  console.log('listening on *:3000');
});