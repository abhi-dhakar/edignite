// models/OTP.model.js
import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
  type: Number,
  default: 0
  },
  userData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, //(600 seconds)
  },
});

export default mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
