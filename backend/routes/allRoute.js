const express = require("express");
const userRouter = require("./user/route");
const mailSenderRoute = require("./mailsender/route");
const smtpRouter = require("./smtp/route");
const pricingRoutes = require("./pricing/route");
const authMiddleware = require("../middleware/auth.middleware");
const axios = require("axios");
const EmailListRoute = require("./list/emailListRoute");
const CampaignPreviewRoute = require("./campaign/campaignPreviewRoute");
const CampaignRoute = require("./campaign/campaignRoute");

const allRoutes = express.Router();


allRoutes.use("/users", userRouter);
allRoutes.use("/mailsender", mailSenderRoute);
allRoutes.use("/smtp", smtpRouter);
allRoutes.use("/pricing",pricingRoutes);
allRoutes.use("/emaillist", EmailListRoute);
allRoutes.use("/campaign/preview", CampaignPreviewRoute)
allRoutes.use("/campaign", CampaignRoute);

module.exports = allRoutes;
