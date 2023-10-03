const express = require('express');
const { getBrevoSmtpWebhookVerification, postBrevoSmtpWebhookEventListener } = require('../../../controllers/campaign/campaignController');
const emailWebhook = express.Router();

emailWebhook.post('/brevo', postBrevoSmtpWebhookEventListener);


module.exports = emailWebhook;