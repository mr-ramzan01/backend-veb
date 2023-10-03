const bcrypt = require("bcryptjs");
const Users = require("../../models/users.schema");

const changePasswordController = async (req, res) => {
  try {
    let { userId, password } = req.body;
    if (userId) {
      if (password) {
        bcrypt.hash(password, 5, async (err, hash) => {
          if (err) {
            res.status(400).send({ message: err.message, status: false });
          } else {
            const updatePassword = await Users.updateOne(
              { _id: userId },
              { password: password }
            );
            return res
              .status(200)
              .send({
                message: "Password changed successfully",
                status: true,
                data: updatePassword,
              });
          }
        });
      } else {
        return res
          .status(400)
          .send({ message: "Not Authenticated", status: false });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Not Authenticated", status: false });
    }
  } catch (error) {
    return res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = changePasswordController;
