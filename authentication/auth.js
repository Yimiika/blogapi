const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userModel = require("../models/users");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

// JWT Strategy (Authentication with Bearer token)
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Signup Strategy
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = new userModel({
          username,
          email_address: req.body.email_address,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          user_type: req.body.user_type,
        });

        const registeredUser = await userModel.register(user, password); // Register user and hash password
        return done(null, registeredUser, {
          message: "User registered Successfully",
        });
      } catch (error) {
        if (error.code === 11000) {
          const duplicateKey = Object.keys(error.keyValue)[0]; // e.g., "email_address"
          return done(null, false, {
            message: `The ${duplicateKey} '${error.keyValue[duplicateKey]}' is already in use`,
          });
        } else if (error.name === "UserExistsError") {
          // Handle case where the username is already taken
          return done(null, false, {
            message: "A user with the given username is already registered",
          });
        }
        return done(error);
      }
    }
  )
);

// Login Strategy
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await userModel.findByUsername(username);

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const result = await user.authenticate(password);

        if (result.error) {
          return done(null, false, {
            message: "Username or password mismatch",
          });
        }

        return done(null, result.user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
