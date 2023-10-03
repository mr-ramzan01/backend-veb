require("dotenv").config();
const Users = require("../../models/users.schema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otp = require("../../utils/generateOtp");
const otpModel = require("../../models/otp.schema");
const sendMailFunction = require("../../utils/sendMailFunction");
const otpGenerator = require("otp-generator");

const userLoginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email && password) {
      let existUser = await Users.findOne({ email: email });
       
      if (existUser) {
        bcryptjs.compare(
          password,
          existUser.password,
          async function (err, result) {
            if (err) {
              res.status(400).send({ message: err.message, status: false });
            } else if (result) {
              
              const clearOtpByUser = await otpModel.deleteMany({
                userId: existUser._id,
              });

              const otpVal = otpGenerator.generate(4, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
              });
              let mailOption = {
                from: process.env.GOOGLEEMAILID,
                to: email,
                subject: `Hey ${existUser.name}`,
                text: `Hey ${existUser.name} your otp is ${otpVal}`,
                // html: `<b>Hello bro ! Your otp is ${otpVal}</b>`,
              };

              let createOtp = new otpModel({
                userId: existUser._id,
                userEmail: email,
                otp: otpVal,
                createdAt: Date.now(),
                expiresAt: Date.now() + 600000,
              });

              await createOtp.save();

              let emailSent = sendMailFunction(mailOption);

              const token = jwt.sign(
                {
                  id: existUser._id,
                  name: existUser.name,
                  email: existUser.email,
                  verified: false,
                  orgNo : existUser.orgNo,
                  phone : existUser.phone,
                  
                },
                process.env.SECRETKEY
              );

              res
                .cookie("authToken", token, {
                  // maxAge: 3600000,
                  httpOnly: true,
                })
                .json({
                  message: "Login successfully",
                  status: true,
                  data: {
                    name: existUser.name,
                    email: existUser.email,
                  },
                });
            } else {
              res
                .status(400)
                .send({ message: "Incorrect password ", status: false });
            }
          }
        );
      } else {
        res
          .status(400)
          .send({ message: "No user found with this email id", status: false });
      }
    } else {
      res
        .status(400)
        .send({ message: "Please provide all required fields", status: false });
    }
  } catch (error) {
    res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = userLoginController;
