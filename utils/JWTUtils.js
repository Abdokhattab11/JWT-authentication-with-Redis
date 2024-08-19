const jwt = require('jsonwebtoken');

const secretKey = "My JWT Secret Key";

exports.generateToken = (userEmail) => {
    const payload = {
        time: Date(),
        userEmail: userEmail
    }
    return jwt.sign(payload, secretKey, {expiresIn: '1h'});
}

exports.validateToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return false;
    }
}