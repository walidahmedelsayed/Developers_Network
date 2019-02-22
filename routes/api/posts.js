const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Hello from posts");
});

module.exports = router;
