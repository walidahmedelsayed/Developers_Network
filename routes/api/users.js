const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = require("../../config/keys").secretKey;

router.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    bcrypt.compare(password, user.password).then(isMatched => {
      if (isMatched) {
        const payLoad = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(payLoad, secretKey, { expiresIn: 3600 }, (err, token) => {
          res.status(200).json({
            success: true,
            token: "bearer " + token
          });
        });
      } else {
        res.status(401).json({ password: "Wrong password" });
      }
    });
  });
});

router.post("/register", (req, res) => {
  var email = req.body.email;
  User.findOne({ email: email }).then(user => {
    if (user) {
      res.status(400).json({ email: "Email already registered" });
    } else {
      var avatar = gravatar.url(req.body.email, {
        s: 200,
        r: "pg",
        d: "mm"
      });
      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
