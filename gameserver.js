let express = require("express");
const session = require("express-session");
const socket = require("socket.io");
const passport = require("./config/passport");
const db = require("./models");
var io = require('socket.io').listen(server);

let PORT = process.env.PORT || 1337;
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// app.use(
//   session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// require("./routes/html-routes.js")(app);
// require("./routes/api-routes.js")(app);
let routes = require("./routes/gamecontroller.js");
app.use(routes);

const server = app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});

const io = socket(server);

io.on("connection", function(socket) {
  console.log('a user connected: ', socket.id);

  players[socket.id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: 576,
    playerId: socket.id,
    message: ""
  };

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {

    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    io.emit('disconnect', socket.id);

  });

  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
  
  socket.on('playerMovement', function (movementData) {

    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    socket.broadcast.emit('playerMoved', players[socket.id]);

  });
});