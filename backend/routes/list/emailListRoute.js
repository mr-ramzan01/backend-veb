const express = require("express")
const { addListUserOne, createEmailList, uploadListUsers, getEmailList, deleteEmailList } = require("../../controllers/list/emailListUserController");
const accessmiddleware = require("../../middleware/access.middleware");
const exceluploads = require("../../middleware/excel.multer");
const multer = require("multer");
const EmailListRoute = express.Router()

const upload = multer({ dest: "uploads/" });

EmailListRoute.get("/get", accessmiddleware, getEmailList);
EmailListRoute.post("/create", accessmiddleware, createEmailList);
EmailListRoute.post("/user/add/one", accessmiddleware, addListUserOne);
EmailListRoute.post("/users/upload", accessmiddleware, upload.single("file"), uploadListUsers);
EmailListRoute.delete("/delete/:id", accessmiddleware, deleteEmailList);

module.exports = EmailListRoute;