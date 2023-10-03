const express = require("express")
const pricing = express.Router()

const {create_pricing} = require("../../controllers/pricing/createPricing")

pricing.post("/create_pricing",create_pricing)

module.exports = pricing