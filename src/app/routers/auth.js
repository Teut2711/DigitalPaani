const express = require("express");
const User = require("../models/User");
const router = express.Router();
const passport = require("passport");

// Routes
router.post("/signup", (req, res) => {
  const { name, username, password } = req.body;
  User.register(new User({ name, username }), password, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Error creating user" });
    }
    res.status(200).json({ message: "User created successfully" });
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "Login successful" });
});

router.get("/logout", (req, res) => {
  req.logout(); // Destroy the session
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
