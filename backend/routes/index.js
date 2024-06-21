const express = require("express");
const router = express.Router();

router.get("/session", function (req, res, next) {
  res.send(req.session);
});

module.exports = router;
