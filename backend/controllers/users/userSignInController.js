const Users = require("../../models/users.schema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUpController = async (req, res) => {
  try {
    let { name, email, password, organisation, industry, phone, radio } =
      req.body;
    if (
      name &&
      email &&
      password &&
      organisation &&
      industry &&
      phone &&
      radio
    ) {
      let existUser = await Users.findOne({ email: email });
      if (existUser) {
        res.status(400).send({
          message: "User with this email id already exist",
          status: false,
        });
      } else {
        let user;
        bcryptjs.hash(password, 5, async (err, hash) => {
          if (err) {
            res.status(400).send({ message: err.message, status: false });
          } else {
            const totalUsers = await Users.findOne().limit(1).sort({orgNo : -1})
            console.log(totalUsers);
            user = new Users({
              name: name,
              email: email,
              password: hash,
              organisation: organisation,
              industry: industry,
              phone: phone,
              radio: radio,
              orgNo: (totalUsers ?(totalUsers.orgNo + 1) : 1),
              signupBy : "Mannual",
              expiryplan : ""
            });
            await user.save();

            // const token = jwt.sign(
            //   {
            //     id: existUser._id,
            //     name: existUser.name,
            //     email: existUser.email,
            //   },
            //   process.env.SECRETKEY
            // );
            // res
            //   .cookie("authToken", token, {
            //     maxAge: 3600000,
            //     httpOnly: true,
            //   })
            //   .json({ message: "user created successfully", status: true });
            res
              .status(200)
              .json({ message: "user created successfully", status: true });
          }
        });
      }
    } else {
      res
        .status(400)
        .send({ message: "Please provide all required fields", status: false });
    }
  } catch (error) {
    res.send(error.message).status(400);
  }
};

module.exports = userSignUpController;
