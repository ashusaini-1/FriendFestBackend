const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/googlelogin").get(
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.route("/google/login").get(
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
  })
);

router.route("/facebooklogin").get(
  passport.authenticate("facebook", {
    scope: ["profile"],
  })
);

router.route("/facebook/login").get(
  passport.authenticate("facebook", {
    successRedirect: process.env.FRONTEND_URL,
  })
);

router.route("/applelogin").get(
  passport.authenticate("apple", {
    scope: ["profile"],
  })
);

router.route("/apple/login").get(
  passport.authenticate("apple", {
    successRedirect: process.env.FRONTEND_URL,
  })
);

module.exports = router;
