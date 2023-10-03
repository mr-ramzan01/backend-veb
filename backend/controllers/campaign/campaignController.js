const Campaign = require("../../models/campaign/campaign");
const CampaignEmailLogs = require("../../models/campaign/campaign.email.logs");
const CampaignPreview = require("../../models/campaign/campaign.preview");
const EmailHardBounce = require("../../models/emails/hard.bounce");
const EmailListUsers = require("../../models/list/list.email.users");

const createCampaign = async (req, res) => {
  try {
    if (req.profile) {
      req.body.orgNo = req.profile.orgNo;
      req.body.createdBy = req.profile._id;

      let emails = await EmailListUsers.find({
        listId: req.body.toListId,
        orgNo: req.profile.orgNo,
      })
        .lean()
        .exec();
      if (emails.length == 0) {
        return res.status(200).send({
          message: "No recipients to send email",
          status: false,
        });
      }
      let newEmails = emails.map((obj) => ({ ...obj, status: "pending" }));

      req.body.to = newEmails;
      req.body.status = "pending";

      await Campaign.create(req.body);
      await CampaignPreview.deleteOne({
        createdBy: req.profile._id,
        orgNo: req.profile.orgNo,
      });

      return res.status(200).send({
        message: "Campaign scheduled successfully",
        status: true,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const getCampaign = async (req, res) => {
  try {
    if (req.profile) {
      let data = await Campaign.find({ orgNo: req.profile.orgNo }).sort({
        createdAt: -1,
      });

      return res.status(200).send({
        message: "Campaign data",
        status: true,
        data,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    if (req.profile) {
      let { id } = req.params;

      await Campaign.deleteOne({ _id: id, orgNo: req.profile.orgNo });
      await CampaignEmailLogs.deleteMany({
        campaignId: id,
        orgNo: req.profile.orgNo,
      });

      return res.status(200).send({
        message: "Campaign deleted Successfully",
        status: true,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const statusChangeCampaign = async (req, res) => {
  try {
    if (req.profile) {
      let { id } = req.body;

      let campaign = await Campaign.findOne({
        _id: id,
        orgNo: req.profile.orgNo,
      });

      if (campaign.status === "done") {
        return res.status(404).send({
          message: "Campaign already finished",
          status: false,
        });
      }
      await Campaign.updateOne(
        { _id: id, orgNo: req.profile.orgNo },
        { $set: { status: req.body.status } }
      );

      return res.status(200).send({
        message: `Campaign ${
          req.body.status === "paused" ? "Paused" : "Enable"
        } Successfully`,
        status: true,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const resendCampaign = async (req, res) => {
  try {
    if (req.profile) {
      let { id } = req.params;

      await Campaign.updateOne(
        { _id: id, orgNo: req.profile.orgNo },
        {
          $inc: { resendCount: 1 },
          $set: { "to.$[].status": "pending", status: "pending" },
        }
      );

      return res.status(200).send({
        message: `Campaign resend setup Successfully`,
        status: true,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const postBrevoSmtpWebhookEventListener = async (req, res) => {
  try {
    let response = req.body;
    console.log("---------------------------------------------------------");
    console.log(response, "response");
    console.log("---------------------------------------------------------");

    const messageId = response["message-id"];

    let log = await CampaignEmailLogs.findOne({ messageId: messageId });

    if (response.event === "delivered") {
      await CampaignEmailLogs.updateOne(
        { messageId: messageId },
        { $set: { status: "delivered" } }
      );

      let deliveredCount = await CampaignEmailLogs.find({
        campaignId: log.campaignId,
        status: "delivered",
      }).count();

      await Campaign.updateOne(
        {
          _id: log.campaignId,
        },
        {
          $set: { emailDeliveredCount: deliveredCount },
        }
      );
    }

    if (response.event === "unique_opened") {
      await Campaign.updateOne(
        {
          _id: log.campaignId,
        },
        {
          $inc: { openCount: 1 },
        }
      );
    }

    if (response.event === "click") {
      await Campaign.updateOne(
        {
          _id: log.campaignId,
        },
        {
          $inc: { clickCount: 1 },
        }
      );
    }

    if (response.event === "hard_bounce") {
      await EmailHardBounce.create({
        email: response.email,
        orgNo: log.orgNo,
      });
    }

    if (response.event === "soft_bounce") {
      await CampaignEmailLogs.updateOne(
        { messageId: messageId },
        { $set: { status: "soft_bounce" } }
      );
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

module.exports = {
  createCampaign,
  getCampaign,
  deleteCampaign,
  statusChangeCampaign,
  postBrevoSmtpWebhookEventListener,
  resendCampaign,
};
