const express = require("express")
const sendMail = require("../../controllers/mailsender/sendMailController")
const {forgetPasswordController,resetPasswordController, updatePassword} = require("../../controllers/users/forgetPassword")
const mailSenderRoute = express.Router()

mailSenderRoute.get("/",sendMail)
mailSenderRoute.post("/forgetPassword",forgetPasswordController)
mailSenderRoute.get("/resetPassword/:id/:token",resetPasswordController)
mailSenderRoute.patch("/updatePassword",updatePassword)

module.exports = mailSenderRoute