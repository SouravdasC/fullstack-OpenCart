
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { errorAsynHandler } from "../utils/errorAsynHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { jwtTokenResponse } from "../utils/jwtTokenResponse.js";
import sendEmail from "../utils/senEmail.js";
import crypto from "crypto"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // for cleanup

// for register user: /api/v1/register
const registerUser = errorAsynHandler(async (req, res, next) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return next(new ErrorHandler(400, "Please provide name, email, and password"));
  }

  // Avatar processing
  let avatar = { public_id: "", url: "" };

  if (req.file) {
    // console.log("Avatar file detected:", req.file.path);

    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    // console.log("Cloudinary upload result:", cloudinaryResponse);

    if (!cloudinaryResponse || !cloudinaryResponse.public_id || !cloudinaryResponse.url) {
      return next(new ErrorHandler(500, "Failed to upload avatar image"));
    }

    avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.url,
    };
  } else {
    return next(new ErrorHandler(400, "Avatar image is required"));
  }


  const user = await User.create(
    {
      name,
      email,
      password,
      avatar
    }
  )

  jwtTokenResponse(201, user, res)
})

// login user: /api/v1/login
const loginUser = errorAsynHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler(400, "Please enter email & password"));
  }

  const user = await User.findOne(
    { email }
  ).select("+password")

  if (!user) {
    return next(new ErrorHandler(404, "Invalid email or password"));
  }

  const isPaswordMatched = await user.comparePassword(password)

  if (!isPaswordMatched) {
    throw new ErrorHandler(401, "Invaild email & password")
  }


  jwtTokenResponse(200, user, res)
})

// logout user : /api/v1/logout
const logoutUser = errorAsynHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true
  })

  res.status(200).json({ success: true, message: "Logged out" })
})

// fogot password token : /api/v1/password/forgot
const forgotPasswordToken = errorAsynHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler(404, "user not found"));
  }

  // get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/v1/password/reset/${resetToken}`
  const resetPasswordUrl = `${process.env.FORNTEND_URL}/password/reset/${resetToken}`

  const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email, then ignore it`;

  try {

    await sendEmail({

      email: user.email,
      subject: `ecommerce password recovery`,
      message,

    });

    res.status(200)
      .json({ success: true, message: `email send to ${user.email} successfully` })

  } catch (error) {

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ErrorHandler(500, error.message)
  }

})

// reset password: /api/v1/password/reset/:token
const resetPasswword = errorAsynHandler(async (req, res, next) => {

  // creating hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  if (!resetPasswordToken) {
    return next(new ErrorHandler(404, "reset password token not found"));
  }

  const user = await User.findOne(
    {
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    }
  )

  if (!user) {
    return next(new ErrorHandler(400, "reset password token is invaild or expired"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(400, "password not matched"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  jwtTokenResponse(200, user, res)
})

// get user details: /api/v1/me
const getUserDetails = errorAsynHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    return next(new ErrorHandler(400, "server error or user token expired"))
  }

  res.status(200).json({ success: true, user })
})

// user update password : /api/v1/password/update
const updateUserPassword = errorAsynHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // for old password
  const isOldPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isOldPasswordMatched) {
    return next(new ErrorHandler(400, "old password is incorrect"))
  }

  // matching new password and confirm password
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler(400, "password does not matched"))
  }

  user.password = req.body.newPassword;

  await user.save();

  jwtTokenResponse(200, user, res)
})

// update user profile : /api/v1/me/update
const updateUserProfile = errorAsynHandler(async (req, res, next) => {

  if (!(req.body || req.body.name)) {
    return next(new ErrorHandler(400, "Name is required"));
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email
  }

  // avatar update profile
  if (req.file) {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;

    await cloudinary.uploader.destroy(imageId);  // <-- This is correct

    const cloudRes = await uploadOnCloudinary(req.file.path);

    if (!cloudRes) return next(new ErrorHandler(500, "Failed to upload avatar"));

    newUserData.avatar = {
      public_id: cloudRes.public_id,
      url: cloudRes.url,
    };
  }


  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true, runValidators: true
  })

  res.status(200).json({ success: true, updatedUser })
})

// get all users for (admin) : /api/v1/admin/users
// GET /api/v1/admin/users
const getAllUser = errorAsynHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  const totalUsers = await User.countDocuments();

  const users = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    users,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    resultPerPage: limit,
  });
});


// get all user details for (admin) : /api/v1/admin/user/:id
const getSingleUser = errorAsynHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(404, `user does not exist width id: ${req.params.id}`));
  }

  res.status(200).json({ success: true, user })
})

// update user role from (admin) : /api/v1/admin/user/:id
const updateUserRole = errorAsynHandler(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }


  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true, runValidators: true
  })

  if (!user) {
    return next(new ErrorHandler(400, `user does not exist with id : ${req.params.id}`))
  }

  // avatar from cloudinary add 
  if (req.file) {
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id)
    }

    const result = await uploadOnCloudinary(req.file.path)

    user.avatar = {
      public_id: result.public_id,
      url: result.url,
    }
  }

  await user.save();

  res.status(200).json({ success: true, user })
})

// delete user from (admin) : /api/v1/admin/user/:id
const deleteUser = errorAsynHandler(async (req, res, next) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler(404, "Invalid product ID"));
  }


  let user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler(404, `user does not exist with id : ${id}`));
  }

  user = await User.findByIdAndDelete(req.params.id)

  // remove cloudinary later

  res.status(200).json({ success: true, message: `user deleted successfully with id: ${req.params.id}` })
})

export { registerUser, loginUser, logoutUser, forgotPasswordToken, resetPasswword, getUserDetails, updateUserPassword, updateUserProfile, getAllUser, getSingleUser, deleteUser, updateUserRole }