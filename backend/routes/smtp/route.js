const express = require("express");
const { addSmtp, getSmtp, deleteSmtp, statusChangeSmtp } = require("../../controllers/smtp/smtpController");
const accessmiddleware = require("../../middleware/access.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const smtpRouter = express.Router();

smtpRouter.use(express.json());

smtpRouter.post("/add", accessmiddleware, addSmtp);
smtpRouter.get("/get", accessmiddleware, getSmtp);
smtpRouter.delete("/delete/:id", accessmiddleware, deleteSmtp);
smtpRouter.patch("/status/update", accessmiddleware, statusChangeSmtp);


module.exports = smtpRouter;
