const mongoose = require("mongoose");

const EmailHardBounceSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    orgNo: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EmailHardBounce =
  mongoose.models.emailhardbounce ||
  mongoose.model("emailhardbounce", EmailHardBounceSchema);

module.exports = EmailHardBounce;
