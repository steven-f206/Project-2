let express = require("express");

let PORT = process.env.PORT || 1337;

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let routes = require("./routes/gamecontroller.js");

app.use(routes);

app.listen(PORT, () => {

  console.log("Server listening on: http://localhost:" + PORT);
});
