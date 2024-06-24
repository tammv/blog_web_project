import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    time: {
      type: Date,
      default: Date.now,
      index: {
          expires: 60, // Hết hạn sau 60 giây
          unit: 'seconds'
      }
    }  
  }
);

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;