const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const user = require("./routes/userRoutes");
const location = require("./routes/locationRoutes");
const cors=require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: 'https://friendfestapp.onrender.com', // Replace with the appropriate frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use("/api/v1", user);
app.use("/api/v1", location);

module.exports = app;
