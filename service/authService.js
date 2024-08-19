const userModel = require('./../model/userModel');
const bcrypt = require('bcryptjs');
const catchAsync = require('./../utils/catchAsync');
const redisClient = require("./../service/redisService");
const jwtUtils = require('./../utils/JWTUtils');
const ErrorDetails = require('./../utils/errorDetails');

exports.login = catchAsync(async (req, res, next) => {
    if (!req.body.email) {
        next(new ErrorDetails(400, "User Email Must Have Value"))
        return;
    }
    if (!req.body.password) {
        next(new ErrorDetails(400, "Password Must Have Value"));
        return;
    }
    const user = await userModel.findOne({email: req.body.email})

    if (!user) {
        next(new ErrorDetails(404, "User Email Not Found"));
        return;
    }
    const hash = user.password;
    const pass = req.body.password;

    if (!bcrypt.compareSync(pass, hash)) {
        next(new ErrorDetails(404, "Password Incorrect"));
        return;
    }
    const token = jwtUtils.generateToken(user.email);

    // Insert token to Redis
    await redisClient.set(token, user.email);


    res.status(200).json({
        status: "Login Success",
        token: token
    });

});
exports.register = catchAsync(async (req, res, next) => {
    try {
        await userModel.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10)
            }
        );
    } catch (err) {
        next(new ErrorDetails(400, err.message));
        return;
    }
    res.status(201).json({
        status: 'Register Successfully'
    });

});
exports.logout = async (req, res, next) => {
    const token = req.body.token;
    await redisClient.del(token);
    res.status(200).json({
        status: "Logout Successfully"
    })
};