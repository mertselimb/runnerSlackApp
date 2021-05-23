const express = require("express"),
  logger = require("morgan"),
  bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var runningRouter = require("./routes/running");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/running", runningRouter);

module.exports = app;
