import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { validPassword, validEmail } from "../utils/validate.js";
import sendEmail from "../utils/sendMail.js";

export const verifyemail = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  if (!validPassword.test(password)) {
    console.log(password);
    next(errorHandler(400, "Password must minimum six characters, at least one letter, one number"));
  }

  if (!validEmail.test(email)) {
    next(errorHandler(400, "Invalid email"));
  }

  try {
    const validUser = await User.findOne({ username });
    const validEmail = await User.findOne({ email });

    if (validUser) {
      return next(errorHandler(400, "Username had been registered"));
    }

    if (validEmail) {
      return next(errorHandler(400, "Email had been registered"));
    }

    let otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp.toString());

    try {
      await sendEmail({
        to: [email],
        subject: "Mã xác thực OTP",
        html:
          "<h1>Xác nhận OTP</h1> <p>Xin chào,</p> <p>Mã OTP của bạn là: <strong>" +
          otp.toString() +
          "</strong></p> <p>Vui lòng nhập mã OTP này vào DevB Blog để xác nhận tài khoản của bạn.</p> <p>Mã OTP này chỉ có giá trị trong 1 phút.</p>  <p>Trân trọng,</p>",
      });

      const hashedOtp = bcryptjs.hashSync(otp.toString(), 10);

      const verifyOtp = await Otp.findOne({ email });
      if (verifyOtp) {
        await Otp.findByIdAndDelete(verifyOtp._id);
      }

      const newOtp = new Otp({
        email: email,
        otp: hashedOtp,
      });

      await newOtp.save();
      res.json("OTP sent successfully!");
    } catch (error) {
      return next(errorHandler(400, error));
    }
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  const { username, email, password, verify } = req.body;

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!validPassword.test(password)) {
    return next(errorHandler(400, "Password must minimum six characters, at least one letter, one number"));
  }

  if (!validEmail.test(email)) {
    return next(errorHandler(400, "Invalid email"));
  }

  const verifyOtp = await Otp.findOne({ email });

  const validOtp = bcryptjs.compareSync(verify, verifyOtp.otp);

  await Otp.findByIdAndDelete(verifyOtp._id);

  if (!validOtp) {
    return next(errorHandler(400, "OTP not correct"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    if (validUser.isBan) {
      return next(errorHandler(401, "Your account has been locked due to violating the blog's terms"));
    }
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (user.isBan) {
        return next(errorHandler(401, "Your account has been locked due to violating the blog's terms"));
      }
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
