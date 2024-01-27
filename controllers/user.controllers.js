const Users = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusHrlperr");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utils/appError");
const bcrypt = require('bcrypt');
const generateJwt = require("../utils/generateJWT");

const getUsers = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await Users.find({}, { "__v": false, "password": false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
    const oldUser = await Users.findOne({ email: req.body.email });
    if (oldUser) {
        const error = AppError.create(400, "User Already Exists", httpStatusText.FAIL);
        return next(error);
    };
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: req.body.role,
        profile: req.file.path
    });
    const token = generateJwt({ email: newUser.email, id: newUser._id, role: newUser.role });
    newUser.token = token;
    await newUser.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res) => {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
        const error = AppError.create(400, "User Not Found", httpStatusText.FAIL);
        return next(error);
    };
    const password = await bcrypt.compare(req.body.password, user.password);
    if (password && user) {
        const token = generateJwt({ email: user.email, id: user._id, role: user.role });
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { token } });
    }
});

module.exports = {
    getUsers,
    register,
    login
};