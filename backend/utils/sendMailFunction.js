require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'acekhurana9@gmail.com', 
    pass: process.env.GOOGLEMAILKEY 
  }
});

const sendMailFunction = (mailOption) => {
  // console.log(mailOption);
  try {
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log("Email sent", info.response);
        return true;
      }
    });
  } catch (error) {
    console.log("err",err.message);
  }
};

module.exports = sendMailFunction;
