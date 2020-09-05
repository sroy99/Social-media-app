const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User"); //gives access to the collection User in mongo DB
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_Secret } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !name || !password) {
    return res.status(422).json({ error: "Please add all the fields" }); //status code 422: Server has understood the request but cant process it
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "A user already exists with the same email" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          name,
          password: hashedPassword,
          pic,
        });
        user
          .save()
          .then(() => {
            res.json({ message: "Successfully signed up your account" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Please create an account first" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((result) => {
          if (!result) {
            return res.status(422).json({ error: "Incorrect email or password. Please try again" });
          }

          //create web token
          const payload = { _id: savedUser._id };
          const token = jwt.sign(payload, JWT_Secret);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({ token, user: { _id, name, email, followers, following, pic } });

          //res.json({ message: "Successfully signed in" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
