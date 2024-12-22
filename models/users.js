const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserModel = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
  },
  email_address: {
    type: String,
    required: [true, "Email address is required"],
    unique: [true, "User with email address already exists"],
  },
  first_name: {
    type: String,
    required: [true, "First name is required"],
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
  },
  user_type: {
    type: String,
    required: [true, "User type is required"],
    enum: {
      values: ["user", "owner"],
      message: "User type must be either 'user' or 'owner'",
    },
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserModel.plugin(passportLocalMongoose);

module.exports = mongoose.model("users", UserModel);
