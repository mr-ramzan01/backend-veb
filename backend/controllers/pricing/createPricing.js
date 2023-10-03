const express = require("express")
const app = express.Router()
const Pricing = require("../../models/pricing.model")

const create_pricing = async(req,res)=>{
    try {
        const pricing = await Pricing.create({})
        return res.status(200).send({message : "Pricing created successfully",data : pricing,status : true})
    } catch (error) {
        return res.status(400).send({message : error.messagem,status : false})
    }
}

module.exports = {create_pricing}