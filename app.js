const logger = require("morgan");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const mainRouter = require("./routes/index");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", mainRouter);

module.exports = app;
