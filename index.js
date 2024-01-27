require('dotenv').config()
const express = require("express");
const app = express();
const coursesRouter = require("./routes/courses");
const usersRouter = require("./routes/users");
const mongoose = require('mongoose');
const httpStatusText = require("./utils/httpStatusHrlperr");
const cors = require("cors");
const path = require("path");

const url = process.env.MONGO_URL
mongoose.connect(`${url}`)
    .then(() => {
        console.log("Connect With DB is Sucessfully");
    });

app.use("/uploads", express.static(path.join(__dirname, '/uploads')));
app.use(cors());
app.use(express.json());
app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.all("*", (req, res, next) => {
    return res.status(404).json({ status: httpStatusText.ERROR, message: "Not Found" });
});
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500)
        .json({ status: err.statusText || httpStatusText.ERROR, message: err.message, code: err.statusCode || 500, data: null });
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening in port: ${port}`);
});