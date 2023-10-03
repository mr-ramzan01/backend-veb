require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("../models/users.schema");

const accessmiddleware = async (req, res, next) => {
  const token = req.cookies.authToken || req.headers.token;
  // console.log("Cookies",req.cookies)
  // console.log(token)
  if (!token) {
    res.status(401).send({ message: "Not Authenticated", status: false });
  } else {
    try {
      let decode = jwt.verify(token, process.env.SECRETKEY);
      if (decode.verified) {
        req.body.userId = decode.id;
        let userData = await Users.findById({ _id: decode.id });
        req.profile = userData;
        next();
      } else {
        res
          .status(401)
          .send({
            message: "Not verified by otp verification process",
            status: false,
          });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(400).send({ message: error.message, status: false });
    }
  }
};

module.exports = accessmiddleware;
