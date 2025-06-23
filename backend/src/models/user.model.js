import mongoose, { Schema } from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Your Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name required minimum 4 characters"]
    },
    email: {
      type: String,
      required: [true, "Please enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please enter Your vaild Email"]
    },
    password: {
      type: String,
      required: [true, "Please enter Your password"],
      minLength: [8, "password should be greater than 8 characters"],
      select: false
    },
    avatar: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    role: {
      type: String,
      default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  }, { timestamps: true }
)

// password encrypted before save 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// JWT token
userSchema.methods.getJWTtoken = function () {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  )
}

// compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

//reset password 
userSchema.methods.getResetPasswordToken = function () {

  // generating rest password token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and add resetPasswordToken to userScehma
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
}


export const User = mongoose.model("User", userSchema)