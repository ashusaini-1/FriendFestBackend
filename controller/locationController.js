const User = require("../model/userModel");
const Location = require("../entities/location");
const asyncHandler = require("express-async-handler");

// Controller for updating a user's location
exports.updateLocation = asyncHandler(async (req, res) => {
  const userEmail = req.user.email; 
  const { latitude, longitude } = req.body;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      res.status(404);
      throw new Error("User not Found");
    }
    const location = await Location.findOne({ user: user._id });
    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.timestamp = new Date();
      await location.save();
    } else {
      const newLocation = new Location({
        user: user._id,
        latitude,
        longitude,
        timestamp: new Date(),
      });
      await newLocation.save();
    }

    res.status(201).json({ message: "Location updated successfully" });
});


exports.getUsersWithinRadius = asyncHandler(async (req, res) => {
  const userEmail = req.user.email; 
  const { latitude, longitude } = req.query;

    // const user = await User.findOne({ email: userEmail });

    // if (!user) {
    //   res.status(404);
    //   throw new Error("User not Found");
    // }
   
    const userLocation = await Location.findOne({ user: User._id });

    if (!userLocation) {
      res.status(404);
      throw new Error("User location not found");
    }

   
    const radius = 0.2;
    const usersWithinRadius = await Location.find({
      user: { $ne: User._id }, 
      latitude: {
        $gte: userLocation.latitude - radius,
        $lte: userLocation.latitude + radius,
      },
      longitude: {
        $gte: userLocation.longitude - radius,
        $lte: userLocation.longitude + radius,
      },
    });

    res.status(201).json(usersWithinRadius);
});