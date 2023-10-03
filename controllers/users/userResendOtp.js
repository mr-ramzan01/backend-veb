require("dotenv").config();
const otpModel = require("../../models/otp.schema");
const otp = require("../../utils/generateOtp");
const sendMailFunction = require("../../utils/sendMailFunction");

const userResendOtp = async (req, res) => {
  try {
    let { name, userId, email } = req.body;
    // console.log("name",name)

    let prevOtp = await otpModel.findOne({ userId: userId });
    if (prevOtp) {
      let clear = await otpModel.deleteMany({
        userId: userId,
      });
      // console.log(clear)

      const otpVal = otp;
      let mailOption = {
        from: process.env.GOOGLEEMAILID,
        to: email,
        subject: `Hey ${name}`,
        text: `Hey ${name} your otp is ${otpVal}`,
        // html: `<b>Hello bro ! Your otp is ${otpVal}</b>`,
      };

      let createOtp = new otpModel({
        userId: userId,
        userEmail: email,
        otp: otpVal,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
      });

      await createOtp.save();

      let emailSent = sendMailFunction(mailOption);

      res.status(200).send({ message: "Otp resend to your mail successfully",status : true });
    } else {
      const otpVal = otp;
      let mailOption = {
        from: process.env.GOOGLEEMAILID,
        to: email,
        subject: `Hey ${name}`,
        text: `Hey ${name} your otp is ${otpVal}`,
        // html: `<b>Hello bro ! Your otp is ${otpVal}</b>`,
      };

      let createOtp = new otpModel({
        userId: userId,
        userEmail: email,
        otp: otpVal,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
      });

      await createOtp.save();

      let emailSent = sendMailFunction(mailOption);

      res.status(200).send({ message: "Otp resend to your mail successfully",status : true });
    }
  } catch (error) {
    res.status(400).send({
      // message: "Not able to send otp on you mail Login again",
      message: error.message,
      status: false,
    });
  }
};

module.exports = userResendOtp;
