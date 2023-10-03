const Users = require("../../../models/users.schema");

const userByIdController = async (req, res) => {
  try {
    let { id } = req.params;
    let { userId } = req.body;
    // console.log("id=>", id, "userId", userId);
    let checkAdmin = await Users.findOne({ _id: userId });
    if (checkAdmin.role === "SuperAdmin") {
      let user = await Users.findOne({ _id: id });
      if (user) {
        return res
          .send({
            message: "data fetch successfully",
            data: user,
            status: true,
          })
          .status(200);
      } else
        return res
          .send({ message: "No user found with this id", status: false })
          .status(400);
    } else {
      console.log("error boss", checkAdmin);
      return res
        .send({ message: "Not access to this request", status: false })
        .status(401);
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

module.exports = userByIdController;
