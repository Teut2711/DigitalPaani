// app.js

const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
const booksRouter = require("./routers/book");
const app = express();
const session = require("express-session");
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key", // Change this to a more secure value
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for user login
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
app.use("/book", booksRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Routes
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Error creating user" });
    }
    res.status(200).json({ message: "User created successfully" });
  });
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "Login successful" });
});

module.exports = { app, isAuthenticated };
