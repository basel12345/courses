const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusHrlperr");

module.exports = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json("token is required");
    }
    const token = authHeader.split(" ")[1];
    try {
        const currentUser = jwt.verify(token, process.env.SECRET_KEY);
        req.currentUser = currentUser;
        next()
    } catch (err) {
        const error = appError.create(401, "Invalid Token", httpStatusText.ERROR);
        return next(error)
    }
}