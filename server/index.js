const express = require('express');
const cors = require('cors')
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

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id)
    socket.on("send_sudoku", (sudoku_data, socketID) => {
        //console.log("Sudoku: ", sudoku_data,  " ", socketID)
        socket.broadcast.emit("update_sudoku", sudoku_data, socketID)
    })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});