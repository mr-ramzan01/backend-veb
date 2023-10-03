const mongoose = require("mongoose");

const EmailListUsersSchema = mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.ObjectId,
      ref: 'emaillists',
      required: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Error in email"],
    },
    gender: {
      type: String,
      required: false,
      enum: ["Male", "Female", "Others"],
    },
    dob: {
      type: String,
      required: false,
    },
    mobileNo: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    zipCode: {
      type: Number,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    jobTitle: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orgNo: {
      type: Number,
      required: true,
    },
    anniversary: {
      type: String,
      required: false,
    },
    preferredLanguage: {
      type: String,
      required: false,
    },
    nationality: {
      type: String,
      required: false,
      enum: ["Indian", "Other"],
    },
    referalSource: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EmailListUsers =
  mongoose.models.emaillistusers ||
  mongoose.model("emaillistusers", EmailListUsersSchema);

module.exports = EmailListUsers;
