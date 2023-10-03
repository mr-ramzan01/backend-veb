require("dotenv").config();
const express = require("express");
const userSignUpController = require("../../controllers/users/userSignInController");
const userLoginController = require("../../controllers/users/userloginController");
const sendVerificationController = require("../../controllers/users/sendVerificationController");
const userVerifyOtp = require("../../controllers/users/userVerifyOtp");
const authMiddleware = require("../../middleware/auth.middleware");
const userResendOtp = require("../../controllers/users/userResendOtp");
const { user } = require("../../controllers/users/user");
const getIp = require("../../middleware/auth.getIP");
const accessmiddleware = require("../../middleware/access.middleware");
const loginHistoryController = require("../../controllers/users/loginHistoryController");
const userLogoutController = require("../../controllers/users/userLogoutController");
const AllUserController = require("../../controllers/users/admin/AllUserController");
const userByIdController = require("../../controllers/users/admin/userByIdController");
const AccessController = require("../../controllers/users/admin/AccessController");
const TakeControl = require("../../controllers/users/admin/TakeControl");
const TakeBackController = require("../../controllers/users/admin/TakeBackController");
const { userOtp } = require("../../controllers/users/userOTP");
const userVerifyPhoneOTP = require("../../controllers/users/userVerifyPhoneOtp");
const profileController = require("../../controllers/users/profile.Controller");
const changePasswordController = require("../../controllers/users/changePassword.Controller");
const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/signup", userSignUpController);
userRouter.post("/login", userLoginController);
userRouter.post(
  "/sendverification",
  authMiddleware,
  sendVerificationController
);
userRouter.get("/me", authMiddleware, user);
userRouter.post("/verifyOTP", authMiddleware, getIp, userVerifyOtp);
userRouter.post("/resendOTP", authMiddleware, userResendOtp);
userRouter.get("/login_history", accessmiddleware, loginHistoryController);
userRouter.post("/logout", userLogoutController);
userRouter.get("/all_users", accessmiddleware, AllUserController);
userRouter.get("/user/:id", accessmiddleware, userByIdController);
userRouter.put("/admin/access/:id", accessmiddleware, AccessController);
userRouter.post("/admin/control/:id", accessmiddleware, TakeControl);
userRouter.post("/admin/access", accessmiddleware, TakeBackController);
userRouter.post("/sendOTP", authMiddleware, userOtp);
userRouter.post("/verify-phone_otp", authMiddleware, userVerifyPhoneOTP);
userRouter.put("/profile", accessmiddleware, profileController);
userRouter.put("/change_pass", accessmiddleware, changePasswordController);

module.exports = userRouter;
