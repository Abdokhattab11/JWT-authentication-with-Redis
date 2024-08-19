const express = require("express");
const ErrorDetails = require("./utils/errorDetails");
const jwtUtils = require("./utils/JWTUtils");
const redisClient = require("./service/redisService");
const authController = require("./controller/authController");
const userController = require("./controller/userController");
const app = express();

app.use(express.json());


app.use(async (req, res, next) => {
    if (req.path === "/api/v1/auth/login" || req.path === "/api/v1/auth/register") {
        next();
        return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next(new ErrorDetails(400, "Authorization Header Missing"));
        return;

    }
    const token = authHeader.substring(7);

    const decode = jwtUtils.validateToken(token);
    if (!decode) {
        next(new ErrorDetails(401, "Unauthenticated"));
        return;
    }
    // Check If it in Cache or not user Logged out
    const cacheResult = await redisClient.get(token);
    if (!cacheResult) {
        next(new ErrorDetails(401, "Unauthenticated"));
        return;
    }
    req.body.email = decode.userEmail;
    req.body.token = token;
    next();
});

app.use('/api/v1/auth', authController)
app.use('/api/v1/user', userController)

// Handle undefined Routes
app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on this server`
    });
});

// Error Handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || err.statusMessage || "failed";
    res.status(statusCode).json({
        status: "fail",
        message: message
    })
})

module.exports = app;
