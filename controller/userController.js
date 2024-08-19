const express = require("express");

const userRouter = express.Router();
const userService = require("./../service/userService");

userRouter.route("/")
    .get(userService.getUser)
    .put(userService.updateUser)
    .delete(userService.deleteUser);

module.exports = userRouter;