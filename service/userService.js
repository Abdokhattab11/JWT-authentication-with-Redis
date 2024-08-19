const userModel = require('./../model/userModel')
const ErrorDetails = require("../utils/errorDetails");
const userDTO = require("./../dto/getUserDto")
const catchAsync = require("../utils/catchAsync");

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await userModel.findOne({email: req.body.email});

    if (!user) {
        next(new ErrorDetails(404, "User Email Not Found"));
        return;
    }

    const getUserDto = new userDTO(user.firstName, user.lastName, user.email);

    res.status(200).json({
        status: "Authenticated",
        data: getUserDto
    })

});

exports.updateUser = catchAsync(async (req, res, next) => {
    try {
        await userModel.findOneAndUpdate({email: req.body.email}, req.body, {runValidators: true})
    } catch (err) {
        next(new ErrorDetails(400, err.message));
    }
    res.status(200).json({
        status: "Update Success"
    });

});

exports.deleteUser = async (req, res, next) => {
    try {
        await userModel.findOneAndDelete(req.body.email);
    } catch (err) {
        next(new ErrorDetails("404", "User Email Not Found"));
        return;
    }
    res.status(200).json({
        status: "Deleted Successfully"
    })
}
