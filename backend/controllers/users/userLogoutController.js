const dayjs = require("dayjs");
const Users = require("../../models/users.schema");

const userLogoutController = async (req, res) => {
  // console.log("helo logout")
  // res.send("hwelo logout")
  try {
    if (req.cookies.authToken) {
      res.cookie("authToken", "", { expires: new Date(0) });
        res.status(200).send({message : "Logout successfully",status : true})
    } else {
      res.send("No cookie found. You are already logged out.");
    }
  } catch (error) {
    res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = userLogoutController;
