const otpModel = require("../../models/otp.schema");
const otp = require("../../utils/generateOtp");
const sendMailFunction = require("../../utils/sendMailFunction");

const sendVerificationController = async (req, res) => {
  try {
    let {userId, email } = req.body;
    const otpVal = otp;

    let mailOption = {
      from: "acekhurana9@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: "OTP verify",
      html: `<b>Hello bro ! Your otp is ${otpVal}</b>`,
    };
    let existUserOtp = await otpModel.findOne({ userId: userId });
    if (existUserOtp) {
      let clearPrevious = await otpModel.deleteMany({ userId: userId });
      const otpVal = otp;
      let mailOption = {
        from: "acekhurana9@gmail.com",
        to: email,
        subject: "Test email subject",
        text: "Test email text",
        html: `<b>Hello bro ! Your otp is ${otpVal}</b>`,
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

      res
        .status(200)
        .send({ message: "Verification otp sent on email", status: true });
    } else {
      let clearPrevious = await otpModel.deleteMany({ userId: id });
      const otpVal = otp;
      let mailOption = {
        from: "acekhurana9@gmail.com",
        to: email,
        subject: "Test email subject",
        text: "Test email text",
        html: `<b>Hello bro ! Your otp is ${otpVal}</b>`,
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

      res
        .status(200)
        .send({ message: "Verification otp sent on email", status: true });
    }
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

module.exports = sendVerificationController;
