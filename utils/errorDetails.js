class ErrorDetails extends Error {
    constructor(statusCode, message, ...args) {
        super(...args)
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ErrorDetails;