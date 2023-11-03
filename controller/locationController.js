const User = require("../model/userModel");
const Location = require("../model/locationModel");
const asyncHandler = require("express-async-handler");
const geolib = require("geolib");


//Add or update user location
exports.addOrUpdateLocation = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    const locationPoint = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    const filter = { user: userId };
    const update = { location: locationPoint };
    const options = { new: true, upsert: true };

    const existingLocation = await Location.findOneAndUpdate(
      filter,
      update,
      options
    );

    if (existingLocation) {
      res.status(200).json({ message: "Location updated successfully" });
    } else {
      const newLocation = new Location({
        user: userId,
        location: locationPoint,
      });

      await newLocation.save();
      res.status(201).json({ message: "Location added successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

exports.getUsersWithinRadius = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required." });
    }

    const userLocations = await Location.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
           $maxDistance: 200,
        },
      },
    }).populate({
      path: "user",
      select: "name _id",
    });

    res.status(200).json({
      success: true,
      userLocations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};
