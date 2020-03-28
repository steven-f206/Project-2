let express = require("express");
const session = require("express-session");
const socket = require("socket.io");
const passport = require("./config/passport");
const db = require("./models");

let PORT = process.env.PORT || 1000;
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
let routes = require("./routes/gamecontroller.js");
app.use(routes);

db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
  });
});

  const io = socket(db);

  io.on("connection", function (socket) {
    console.log("made socket connection", socket.id);

    socket.on("chat", function (data) {
      io.sockets.emit("chat", data);
    });
  });
