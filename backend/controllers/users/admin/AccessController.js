const Users = require("../../../models/users.schema");

const AccessController = async (req, res) => {
  try {
    const { userId, access } = req.body;
    let { id } = req.params;
    if (userId === id) {
      return res.status(400)
        .send({ message: "You cannot change your own access", status: false })
    }
    if (userId) {
      let checkAdmin = await Users.findOne({ _id: userId });
      if (checkAdmin.role === "SuperAdmin") {
        let user = await Users.findOne({ _id: id });
        if (user) {
          let update = await Users.findByIdAndUpdate(
            { _id: id },
            { access: access },
            { new: true }
          );
          return res
            .status(200)
            .send({
              message: "Access removed successfully",
              status: true,
              data: update,
            });
        } else {
          return res
            .status(400)
            .send({ message: "No user found with this id", status: false });
        }
      } else {
        return res
          .status(400)
          .send({ message: "Access Denied", status: false });
      }
    } else {
      return res
        .status(400)
        .send({ message: "No Token found please login", status: false });
    }
  } catch (error) {
    console.log("error boss");
    return res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = AccessController;
