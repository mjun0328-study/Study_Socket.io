const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const cors = require("cors");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    mathods: ["GET", "POST"],
  },
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", async (socket) => {
  socket.on("upload_msg", (arg) => {
    console.log(arg);
    io.to("channel-" + arg.channel).emit("download_msg", { message: arg.msg });
  });

  socket.on("join", (channel) => {
    channel = channel.channel;
    socket.join("channel-" + channel);
    socket.emit("join_complete");
  });
});

app.use(function (req, res, next) {
  res.io = io;
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

app.use("/", require("./routes/index"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("Boom!");
});

module.exports = { app, server };
