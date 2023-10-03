const mongoose = require("mongoose");

const CampaignPreviewSchema = mongoose.Schema(
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
      required: false,
    },
    emailSubject: {
      type: String, 
      required: false,
    },
    fromEmail: {
      type: String, 
      required: false,
    },
    fromName: {
      type: String, 
      required: false,
    },
    replyTo: {
      type: String, 
      required: false,
    },
    trackClicks: {
      type: Boolean, 
      required: false,
    },
    trackOpens: {
      type: Boolean, 
      required: false,
    },
    template: {
      type: String,
      required: false
    },
    deliveryDate: {
      type: String,
      required: false,
    },
    deliveryTime: {
      type: String,
      required: false
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

const CampaignPreview =
  mongoose.models.campaignpreview || mongoose.model("campaignpreview", CampaignPreviewSchema);

module.exports = CampaignPreview;
