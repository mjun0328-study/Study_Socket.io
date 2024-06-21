const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const cors = require("cors");
const session = require("express-session");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1);
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: true,
  secret: "Hello, Socket.io!",
});

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

io.on("connection", async (socket) => {
  socket.on("upload_msg", (arg) => {
    const session = socket.request.session;
    const name = session.name ?? "Unknown";
    io.to("channel-" + arg.channel).emit("download_msg", {
      channel: arg.channel,
      message: arg.msg,
      sender: name,
    });
  });

  socket.on("join", (arg) => {
    socket.join("channel-" + arg.channel);
    socket.emit("join_complete", { channel: arg.channel });
  });

  socket.on("leave", (arg) => {
    socket.leave("channel-" + arg.channel);
  });

  socket.on("setName", (arg) => {
    const req = socket.request;
    req.session.reload((err) => {
      if (err) socket.disconnect();
      req.session.name = arg.name;
      req.session.save();
    });
  });
});

app.use(function (req, res, next) {
  res.io = io;
  next();
});

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
