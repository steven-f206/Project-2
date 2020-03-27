let express = require("express");
const socket = require("socket.io");

let PORT = process.env.PORT || 1337;

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let routes = require("./routes/gamecontroller.js");

app.use(routes);

const server = app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});

const io = socket(server);

io.on("connection", function(socket) {
  console.log("made socket connection", socket.id);

  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
});
