const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const user = require("./routes/userRoutes");
const location = require("./routes/locationRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", user);
app.use("/api/v1", location);

module.exports = app;
