import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const {username, password, email, isAdmin, isPremium, profilePicture, dateOfPre} = req.body;

    if(!username || !password || !email || username === '' || password === '' || email === ''){
        return res.status(400).json({message: 'All fields are required'});
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
        res.status(500).json({message: error.message});
    }
}
