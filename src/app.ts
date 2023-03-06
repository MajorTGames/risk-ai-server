import "es6-shim"; // this shim is optional if you are using old version of node
import "reflect-metadata"; // this shim is required
import { SocketControllers } from "socket-controllers";
import { MessageController } from "./api/MessageController";
import { Container } from "typedi"; // Only if you are using typedi

new SocketControllers({
  port: 3001,
  container: Container,
  controllers: [MessageController],
});

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import "reflect-metadata";
import cors from "cors";

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
