const otpModel = require("../../models/otp.schema");
const jwt = require("jsonwebtoken");
const Users = require("../../models/users.schema");

const userVerifyPhoneOTP = async (req, res) => {
  const { userId, otp } = req.body;
  const { organisation, industry, phone } = req.user;
  try {
    if (otp) {
      const existingOtp = await otpModel.findOne({ userId: userId });
      if (existingOtp) {
        let { expiresAt, otp: dbOtp } = existingOtp;
        if (expiresAt < Date.now()) {
          let deleteOtp = await otpModel.deleteOne({ userId: userId });
          return res
            .status(400)
            .json({ message: "OTP expires,Click on Resend", status: false });
        } else if (dbOtp === otp) {
          const user = await Users.findOne({ _id: userId });
          let deleteOtp = await otpModel.deleteOne({ userId: userId });

          const updateUser = await Users.updateOne({_id : userId} , {$set:{organisation : organisation , industry : industry , phone : phone}})

          const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: phone,
            orgNo: user.orgNo,
            verified: true,
            signupBy : user.signupBy
          },process.env.SECRETKEY);
          return res.cookie("authToken",token,{
            httpOnly: true,
          })
            .status(200)
            .json({ message: "OTP Verified Successfully", status: true });
        } else if (dbOtp !== otp) {
          console.log("wrong otp");
          return res
            .status(400)
            .json({ message: "Otp is incorrect", status: false });
        }
      } else {
        return res
            .status(400)
            .json({ message: "Send OTP Again", status: false });
        
      }
    } else {
      return res
        .status(400)
        .json({ message: "Please Provide Otp", status: false });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: `error, ${error.message}`, status: false });
  }
};

module.exports = userVerifyPhoneOTP;
