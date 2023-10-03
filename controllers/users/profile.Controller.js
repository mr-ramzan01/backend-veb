const Users = require("../../models/users.schema");

const profileController = async (req, res) => {
  try {
    const { userId, ...rest } = req.body;
    if (userId) {
      const user = await Users.findOne({ _id: userId });
      if (user) {
        const updateUser = await Users.updateOne(
          { _id: userId },
          { ...rest },
          { new: true }
        );
        return res
          .status(200)
          .send({ message: "Updated profile successfully", status: true,data:updateUser });
      } else {
        return res
          .status(400)
          .send({ message: "No User found", status: false });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Not Authenticated", status: false });
    }
  } catch (error) {}
};

module.exports = profileController;
