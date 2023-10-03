const otpGenerator = require("otp-generator");

const otp = otpGenerator.generate(4, {
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false,
});


module.exports = otp;
