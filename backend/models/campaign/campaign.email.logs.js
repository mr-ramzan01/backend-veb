const mongoose = require("mongoose");

const CampaignEmailLogssSchema = mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    accepted: {
        type: Array,
        required: false
    },
    rejected: {
        type: Array,
        required: false
    },
    ehlo: {
        type: Array,
        required: false
    },
    envelopeTime: {
        type: Number,
        required: false
    },
    messageTime: {
        type: Number,
        required: false
    },
    messageSize: {
        type: Number,
        required: false
    },
    response: {
        type: String,
        required: false
    },
    envelope: {
        type: Object,
        required: false
    },
    messageId: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    orgNo: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CampaignEmailLogs =
  mongoose.models.campaignemaillogs || mongoose.model("campaignemaillogs", CampaignEmailLogssSchema);

module.exports = CampaignEmailLogs;
