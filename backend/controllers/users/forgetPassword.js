const express = require("express");
const Users = require("../../models/users.schema");
const jwt = require("jsonwebtoken");
const sendMailFunction = require("../../utils/sendMailFunction");
const bcryptjs = require("bcryptjs");

const forgetPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    let findUser = await Users.findOne({ email });
    if (!findUser) {
      return res
        .status(400).
        send({
          message: `User does not exist with ${email} id`,
          status: false,
        });
    }
    else if(findUser.signupBy){
      return (findUser.signupBy==="Google" ? res.status(400).send({message : "Sign in by google",status: false}) : res.status(400).send({message : "Sign up by Facebook",status: false}))
     }

    let secret = process.env.SECRETKEY + findUser.password;
    const token = jwt.sign({ id: findUser.id, email: findUser.email }, secret, {
      expiresIn: "5m",
    });
    let id = findUser._id;
    const mailOptions = {
      from: "acekhurana9@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `${process.env.FRONTEND_URL}resetPassword/${id}/${token}`,
    };

    let emailSent = sendMailFunction(mailOptions);

    res
      .status(200)
      .send({ message: "Verification link sent on email", status: true });
  } catch (err) {
    console.log(`err,${err.message}`);
    res.send(`err,${err.message}`);
  }
};

const resetPasswordController = async (req, res) => {
  const id = req.params.id;
  const token = req.params.token;

  try {
    let findUser = await Users.findOne({ _id: id });
    let secret = process.env.SECRETKEY + findUser.password;
    const verifyTokenId = jwt.verify(token, secret);
    if (verifyTokenId) {
      res.send("Verified");
    } else {
      res.send("not valid link or expired link");
    }
  } catch (err) {
    res.send(err.message);
  }
};

const updatePassword = async (req, res) => {
  const { id, password } = req.body;
  console.log(id, password);
  try {
    const findUser = await Users.findOne({ _id: id });
    console.log(findUser);
    if (!findUser) {
      return res
        .status(400)
        .send({ message: "User does not exist", status: false });
    }
    let newPassword;
    bcryptjs.hash(password, 8, async function (err, hash) {
      if (err) {
        return res.status(400).send({ message: err.message, status: false });
      } else {
        newPassword = hash;
        const updatePassword = await Users.updateOne(
          {
            _id: id,
          },
          { password: newPassword }
        );
        return res.status(200).send({message : "Password Updated Successfully" ,status : 200 , data : updatePassword})
      }
    });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  forgetPasswordController,
  resetPasswordController,
  updatePassword,
};
