const express = require("express");
const accessmiddleware = require("../../middleware/access.middleware");
const { createPreviewData, getPreviewData, uploadTemplate } = require("../../controllers/campaign/campaignPreviewController");
const multer = require("multer");
const CampaignPreviewRoute = express.Router();

const upload = multer({ dest: "uploads/" });


CampaignPreviewRoute.post("/create", accessmiddleware, createPreviewData);
CampaignPreviewRoute.post("/upload/template", accessmiddleware, upload.single("file"), uploadTemplate);
CampaignPreviewRoute.get("/get", accessmiddleware, getPreviewData);

module.exports = CampaignPreviewRoute;