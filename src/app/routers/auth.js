const express = require("express");
const User = require("../models/User");
const router = express.Router();
const passport = require("passport");

// Routes
router.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // If the username doesn't exist, proceed to register the user
    const user = await User.register(new User({ name, username }), password);

    // If registration succeeds, send success response
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    // Check if the error is due to validation failures
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // If the error is not specifically handled, return a generic error message
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "Login successful" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json({ message: "Unable to log out" });
    } else {
      res.json({ message: "Logout successful" });
    }
  }); // Destroy the session
});

module.exports = router;
