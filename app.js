const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const user = require("./routes/userRoutes");
const location = require("./routes/locationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
 const passportRoutes = require("./routes/passportRoutes");
const cors = require("cors");

const passport = require("passport");
const session = require("express-session");
const { connectPassport } = require("./controller/google-auth");
const { connectFacebook } = require("./controller/facebook-auth");

dotenv.config({ path: "config/config.env" });
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    //   cookie: {
    //     secure: process.env.NODE_ENV === "development" ? false : true,
    //     httpOnly: process.env.NODE_ENV === "development" ? false : true,
    //     sameSite: process.env.NODE_ENV === "development" ? false : "none",
    //   },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
connectPassport();
connectFacebook();
app.enable("trust proxy");

// const corsOptions = {
//     origin: 'https://friendfestapp.onrender.com', // Replace with the appropriate frontend URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   };

// app.use(cors(corsOptions));

//for facebook



app.use("/api/user", user);
app.use("/api/location", location);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/passport", passportRoutes);

module.exports = app;
