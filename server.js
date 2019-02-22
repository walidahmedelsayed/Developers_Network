const express = require("express");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const db = require("./config/keys").mongo_URI;
const app = express();
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MLab");
  })
  .catch(err => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(port);
