const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Please provide the userId"],
  },
  userEmail: {
    type: String
  },
  userPhone : {
    type : Number,
  },
  otp: {
    type: String,
    required: [true, "please provide the otp"],
  },
  createdAt: {
    type: String,
    required: [true, "please provide the created at time"],
  },
  expiresAt: {
    type: String,
    required: [true, "please provide the created at time"],
  }
});

const otpModel = mongoose.model("otp", otpSchema);

module.exports = otpModel
