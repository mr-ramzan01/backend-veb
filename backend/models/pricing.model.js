const mongoose = require("mongoose")

const PricingSchema  = new mongoose.Schema({
    title : {type : String},
    line1 : {type : String},
    price : {type : Number},
    social_acc : {type : String},
    storage_size : {type : String},
    file_size : {type : String}
})

const PricingModel = mongoose.model("pricing",PricingSchema)
module.exports = PricingModel;