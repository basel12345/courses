const express = require("express");
const courseControllers = require("../controllers/course.controllers");
const router = express.Router();
const { validationSchema } = require("../middleware/validationSchema");
const verfiyToken = require("../middleware/auth");
const allowedTo = require("../middleware/allowedTo");
const { Roles } = require("../utils/roles");

router.route("/")
    .get(verfiyToken, courseControllers.getCourses)
    .post(verfiyToken, validationSchema(), courseControllers.addCourse);

router.route("/:courseId")
    .get(verfiyToken, courseControllers.getCourse)
    .patch(verfiyToken, courseControllers.updateCourse)
    .delete(verfiyToken, allowedTo(Roles.ADMIN, Roles.MANGER), courseControllers.deleteCourse);

module.exports = router;