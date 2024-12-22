const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "An internal error occurred" });
    }

    if (!user) {
      return res.status(409).json({ error: info.message });
    }

    // Successfully registered user
    res.status(201).json({
      message: info.message,
      user: {
        username: user.username,
        email: user.email_address,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  })(req, res, next);
});

authRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ error: "An internal error occurred" });
    }

    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    // Successful login
    req.login(user, { session: false }, async (loginError) => {
      if (loginError) {
        console.error("Login Processing Error:", loginError);
        return next(loginError);
      }

      const body = { _id: user._id, username: user.username };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({ token });
    });
  })(req, res, next);
});

module.exports = authRouter;
