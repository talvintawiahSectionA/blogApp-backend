const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
require("dotenv").config();

const router = express.Router();

const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Check if the secret key is available
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("Missing ACCESS_TOKEN_SECRET in environment variables");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).json({
      message: "User registered successfully",
      username: newUser.username,
      email: newUser.email,
      code: newUser.id,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(password, existingUser.password)) {
      const accessToken = jwt.sign(
        existingUser.toJSON(),
        process.env.ACCESS_TOKEN_SECRET
      );
      res
        .status(201)
        .json({
          accessToken: accessToken,
          username: existingUser.username,
          email: existingUser.email,
          code: existingUser.id,
        });
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login attempt failed" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
