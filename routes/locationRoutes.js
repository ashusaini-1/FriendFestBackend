const express = require("express");
const router = express.Router();
const {
  addOrUpdateLocation,
  getUsersWithinRadius,
} = require("../controller/locationController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/location/upsert").post(isAuthenticatedUser, addOrUpdateLocation);

router.route("/nearby/users").get(getUsersWithinRadius);
module.exports = router;
