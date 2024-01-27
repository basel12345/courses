const express = require("express");
const userControllers = require("../controllers/user.controllers");
const router = express.Router();
const { validationSchema } = require("../middleware/validationSchema");
const verfiyToken = require("../middleware/auth");
const multer = require("multer");
const appError = require("../utils/appError");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + ext)
    },
})


const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0];
    if (imageType === "image") {
        return cb(null, true);
    } else {
        return cb(appError.create(400, "file must be an image"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter
})
router.route("/")
    .get(verfiyToken, userControllers.getUsers);
router.route("/register")
    .post(upload.single("profile"), userControllers.register);
router.route("/login")
    .post(userControllers.login);

module.exports = router;