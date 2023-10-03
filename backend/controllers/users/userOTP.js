const otpGenerator = require("otp-generator");
const otpModel = require("../../models/otp.schema");
const axios = require("axios");
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false,
});
const jwt = require("jsonwebtoken");
const Users = require("../../models/users.schema");

const userOtp = async (req, res) => {
  const { organisation, industry, phone } = req.body;
  const userID = req.body.userId;
  console.log(userID);

  try {
    const existingUser = await Users.findOne({ _id: userID });
    const clearOtpByUser = await otpModel.deleteMany({
      userId: userID,
    });

    const otpVal = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const response = await axios.get(
      `http://164.52.195.161/API/SendMsg.aspx?uname=20181851&pass=29sWsuVm&send=SOIIMs&dest=${phone}&msg=Dear%20chandan%0AThanks%20for%20showing%20Interest%20in%20zoom%20webinar%20on%2012septe%20at%208%20PM%0AMeeting%20ID%20:%20${otpVal}%0APassword%20:%20soiim%0ACNS%20Web%20Technologies`,
      { httpsAgent: agent }
    );

    const StoreOtp = await otpModel.create({
      userId: userID,
      userPhone: phone,
      otp : otpVal,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        orgNo: existingUser.orgNo,
        phone: phone,
        signupBy: existingUser.signupBy,
        verified: false,
        organisation: organisation,
        industry: industry,
      },
      process.env.SECRETKEY
    );
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);
    // console.log("response", response.data);
    // console.log(otpVal);
    res
      .cookie("authToken", token, {
        expires: expirationDate,
        httpOnly: true,
      })
      .json({
        message: "Otp Sent Successfully",
        token: token,
        msg: response.data,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error : ${error.message}`, status: false });
  }
};

module.exports = { userOtp };
