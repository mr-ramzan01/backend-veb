const bcrypt = require("bcrypt");
const Users = require("../../../models/users.schema");
const jwt = require("jsonwebtoken");

const TakeBackController = async (req, res) => {
  try {
    const { hashStr } = req.body;
    if (hashStr) {
      const adminFinder = await Users.findOne({
        _id: hashStr,
      });
      if (adminFinder.role === "SuperAdmin") {
        const token = jwt.sign(
          {
            id: adminFinder._id,
            name: adminFinder.name,
            email: adminFinder.email,
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
              name: adminFinder.name,
              email: adminFinder.email,
            },
          });
      } else {
        res.status(400).send({
          message: "No Super admin found",
          status: false,
        });
      }
    } else {
      res
        .status(400)
        .send({ message: "Requirement not fulfilled", status: false });
    }
  } catch (error) {
    res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = TakeBackController;
