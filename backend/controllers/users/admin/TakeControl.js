const Users = require("../../../models/users.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const TakeControl = async (req, res) => {
  try {
    const adminUserId = req.body.userId;
    const commonUserId = req.params.id;

    if (adminUserId && commonUserId) {
      const findCommonUser = await Users.findOne({ _id: commonUserId });
      console.log("admin id ",adminUserId)

      if (findCommonUser) {

        const token = jwt.sign(
          {
            id: findCommonUser._id,
            name: findCommonUser.name,
            email: findCommonUser.email,
            verified: true,
          },
          process.env.SECRETKEY
        );

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 3);
        return res
          .cookie("authToken", token, {
            expires: expirationDate,
            httpOnly: true,
          })
          .json({
            message: "Accessed",
            status: true,
            data: {
              name: findCommonUser.name,
              email: findCommonUser.email,
              access: adminUserId
              
              ,
            },
          });
      } else {
        res.status(400).send({ message: "Invalid user" });
      }
    } else {
      res
        .status(400)
        .send({ message: "Requirement of id not fulfilled", status: false });
    }
  } catch (error) {
    return res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = TakeControl;
