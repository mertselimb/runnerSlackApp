const express = require("express"),
  logger = require("morgan"),
  bodyParser = require("body-parser");

const runningRouter = require("./routes/running"),
  leaderboardRouter = require("./routes/leaderboard"),
  bikingRouter = require("./routes/biking");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/running", runningRouter);
app.use("/biking", bikingRouter);
app.use("/leaderboard", leaderboardRouter);

module.exports = app;
