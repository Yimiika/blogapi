const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("dotenv").config();

require("./authentication/auth");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const blogsRoute = require("./routes/blogs");
const ownersRoute = require("./routes/owners");
const verifyOwner = require("./middleware/verifyOwner");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(passport.initialize());

app.set("views", "views");
app.set("view engine", "ejs");

// Routes
app.use("/", authRoute); // Unprotected auth routes
app.use("/users", passport.authenticate("jwt", { session: false }), usersRoute); // Protected user routes
app.use(
  "/owners",
  passport.authenticate("jwt", { session: false }),
  verifyOwner,
  ownersRoute
); //protected owner routes
app.use("/blogs", blogsRoute); // Unprotected blog routes

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
