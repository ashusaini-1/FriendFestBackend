const User = require("../model/userModel");
const { sendToken } = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");


//Register User
module.exports.registerUser = async (req, res, next) => {
  const { name, email, password ,contact} = req.body;

  try {
    if (!name || !email ||!contact|| !password) {
      return next(new ErrorHandler("Please Enter all the Details", 401));
    }

    const userExists = await User.findOne({email});
    const numberExists = await User.findOne({contact});

    if (userExists ||numberExists ) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      contact,
      password
    });

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//Login User
module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;

   
    user.password = newPassword;

   
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
module.exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

//get All User Details
module.exports.allUser = async (req, res) => {
  try {
    const allUser = await User.find({}, "name email");

    res.status(200).json({
      success: true,
      allUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

//delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

//update User
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    const user = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
