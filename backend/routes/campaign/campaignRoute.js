const express = require("express");
const accessmiddleware = require("../../middleware/access.middleware");
const { createCampaign, getCampaign, deleteCampaign, statusChangeCampaign, resendCampaign } = require("../../controllers/campaign/campaignController");
const emailWebhook = require("./webhook/emailWebhook");
const CampaignRoute = express.Router();


CampaignRoute.post("/create", accessmiddleware, createCampaign);
CampaignRoute.get("/get", accessmiddleware, getCampaign);
CampaignRoute.delete("/delete/:id", accessmiddleware, deleteCampaign);
CampaignRoute.patch("/status/change", accessmiddleware, statusChangeCampaign);
CampaignRoute.patch("/resend/:id", accessmiddleware, resendCampaign);
CampaignRoute.use('/webhook', emailWebhook);

module.exports = CampaignRoute;