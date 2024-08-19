const express = require("express");

const authService = require("./../service/authService");
const authRouter = express.Router();


authRouter.route("/register").post(authService.register);
authRouter.route("/login").post(authService.login);
authRouter.route("/logout").post(authService.logout);


module.exports = authRouter;