
const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Please provide the userid"],
  },
  ip: {
    type: String,
    required: [true, "Please provide the Ip"],
  },
  browser: {
    type: String,
    required: [true, " Please provide the Browser"],
  },
  os: {
    type: String,
    required: [true, "Please provide the os"],
  },
  isMobile: {
    type: Boolean,
    required: [true, "Please provide the isMobile"],
  },
  loginAt: {
    type : String ,
    required : [true ,"Please provide login at field"]
  },
  logoutAt: {
    type: String,
  },
});

let loginHistoryModel = mongoose.model("login-history", loginHistorySchema);

module.exports = loginHistoryModel;
