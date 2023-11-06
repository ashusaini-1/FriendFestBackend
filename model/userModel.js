const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  dob: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"] },

  email: {
    type: String,

    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  photo: String,

  googleId: {
    type: String,
   default:"null"
   
  },
  facebookId: {
    type: String,
    default:"null"

   
  },
  appleId: {
    type: String,
    default:"null"

   
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

//to get JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// to compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
