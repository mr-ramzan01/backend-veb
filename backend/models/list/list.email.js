const mongoose = require("mongoose");

const EmailListSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    defaultFromName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    zipCode: {
      type: Number,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
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
    listName: {
      type: String,
      required: true,
    },
    listCount: {
      type: Number, 
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EmailLists =
  mongoose.models.emaillists || mongoose.model("emaillists", EmailListSchema);

module.exports = EmailLists;
