const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.io.emit("download_msg", "Hello, World!");
  res.send("Hello, World!");
});

module.exports = router;
