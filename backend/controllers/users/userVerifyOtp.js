const otpModel = require("../../models/otp.schema");
const loginHistoryModel = require("../../models/loginHistory.schema");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const Users = require("../../models/users.schema");

const userVerifyOtp = async (req, res) => {
  try {
    let { userId, otp, ip, browsername, os, mobile } = req.body;
    if (otp) {
      const userOtpVerificationRecord = await otpModel.findOne({
        userId: userId,
      });
      if (userOtpVerificationRecord) {
        let { expiresAt, otp: dbOtp } = userOtpVerificationRecord;
        if (expiresAt < Date.now()) {
          await otpModel.deleteMany({ userId: userId });
          res
            .status(400)
            .send({ message: "Otp has expired , Please request again" });
        } else {
          if (dbOtp === otp) {
            await otpModel.deleteMany({ userId: userId });

            // create login history
            const createHistory = new loginHistoryModel({
              userId: userId,
              ip: ip,
              browser: browsername,
              os: os,
              isMobile: mobile,
              loginAt: dayjs().format(),
              logoutAt : ""
            });
            await createHistory.save();

            let existUser = await Users.findOne({ _id: userId });

            const token = jwt.sign(
              {
                id: existUser._id,
                name: existUser.name,
                email: existUser.email,
                verified: true,
              },
              process.env.SECRETKEY
            );
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 3)
            res
              .cookie("authToken", token, {
                expires: expirationDate,
                httpOnly: true,
              })
              .json({
                message: "Verified successfully",
                status: true,
                data: {
                  name: existUser.name,
                  email: existUser.email,
                },
              });
          } else {
            res.status(400).send({ message: "Otp is incorrect" });
          }
        }
      } else {
        res
          .status(400)
          .send({ message: "User record doesn't exist Please Sign up again" });
      }
    } else {
      res.status(400).send({ message: "Please provide otp", status: false });
    }
  } catch (error) {
    res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = userVerifyOtp;
