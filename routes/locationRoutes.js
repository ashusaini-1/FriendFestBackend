const express = require("express");
const router = express.Router();
const { updateLocation, getUsersWithinRadius }= require("../controller/locationController");

// User registration route
router.route("/update-location").post(updateLocation);

// User login route
router("/radius").post(getUsersWithinRadius);
module.exports = router;