const loginHistoryModel = require("../../models/loginHistory.schema");
const { user } = require("./user");

const loginHistoryController = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = await loginHistoryModel.find({ userId: userId });
    return res
      .status(200)
      .send({ message: "data fetched successfully", status: true, data: data });
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

module.exports = loginHistoryController;
