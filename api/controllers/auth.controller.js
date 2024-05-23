import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const {username, password, email, isAdmin, isPremium, profilePicture, dateOfPre} = req.body;

    if(!username || !password || !email || username === '' || password === '' || email === ''){
        next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        password: hashedPassword,
        email,
        isAdmin,
        isPremium,
        profilePicture,
        dateOfPre
    });

    try {
        await newUser.save();
        res.json('Signup Successful!');
    } catch (error) {
        next(error);
    }
}
