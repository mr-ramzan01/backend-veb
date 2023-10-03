const mongoose = require("mongoose");
const validator = require("validator");

const smtpSchema = mongoose.Schema({
  smtpName: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true
  },
  apiKey: {
    type: String,
    required: false,
  },
  hostName: {
    type: String,
    required: false,
  },
  apiRegion: {
    type: String,
    required: false,
  },
  domain: {
    type: String,
    required: false,
  },
  smtpServer: {
    type: String,
    required: false,
  },
  smtpUsername: {
    type: String,
    required: false,
  },
  smtpPassword: {
    type: String,
    required: false,
  },
  smtpPort: {
    type: Number,
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  orgNo: {
    type: Number,
    required: true
  },
  encriptionMethod: {
    type: String,
    required: false
  },
  isApproved: {
    type: Boolean,
    default: false
  }
},
{
  versionKey: false,
  timestamps: true
});

const Smtp = mongoose.models.smtps || mongoose.model("smtps", smtpSchema);

module.exports = Smtp;
