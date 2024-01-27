const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusHrlperr");

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            return next(appError.create(401, "this role is not authorized", httpStatusText.ERROR));
        }
        next();
    }
}