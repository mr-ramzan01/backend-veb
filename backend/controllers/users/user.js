const Users = require("../../models/users.schema");

const user = async (req, res) => {
  const id = req.body.userId;
  try {
    const findUser = await Users.findOne({ _id: id });
    if (!findUser) {
      return res.status(400).send({ message: "User not Found", status: false });
    }

    return res.status(200).send({ user: findUser, status: true });
  } catch (error) {
    return res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = { user };
