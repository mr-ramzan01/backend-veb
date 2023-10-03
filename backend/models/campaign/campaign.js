const mongoose = require("mongoose");

const CampaignSchema = mongoose.Schema(
  {
    toList: {
      type: String,
      required: true,
    },
    toListId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    campaignName: {
      type: String,
      required: true,
    },
    emailSubject: {
      type: String, 
      required: true,
    },
    fromEmail: {
      type: String, 
      required: true,
    },
    fromName: {
      type: String, 
      required: true,
    },
    replyTo: {
      type: String, 
      required: true,
    },
    trackClicks: {
      type: Boolean, 
      required: true,
    },
    trackOpens: {
      type: Boolean, 
      required: true,
    },
    clickCount: {
      type: Number, 
      required: false,
      default: 0
    },
    emailDeliveredCount: {
      type: Number, 
      required: false,
      default: 0
    },
    emailSentCount: {
      type: Number, 
      required: false,
      default: 0
    },
    resendCount: {
        type: Number,
        required: false,
        default: 0
    },
    openCount: {
      type: Number, 
      required: false,
      default: 0
    },
    to: {
      type: Array,
      required: true,
    },
    status: {
        type: String,
        required: true,
    },
    template: {
      type: String,
      required: true
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true
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

const Campaign =
  mongoose.models.campaigns || mongoose.model("campaigns", CampaignSchema);

module.exports = Campaign;
