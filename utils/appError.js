class AppError extends Error {
    constructor() {
        super();
    }

    create(statusCode, message, statusText) {
        this.statusCode = statusCode;
        this.message = message;
        this.statusText = statusText;
        return this;
    }
}

module.exports = new AppError();