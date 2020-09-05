const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");

require("./models/user");
require("./models/post"); //register our db in Server
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB server");
});
mongoose.connection.on("error", (err) => {
  console.log("Connection error", err);
});

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/postRoute"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server at port " + port);
});
