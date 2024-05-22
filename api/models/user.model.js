import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    isPremium:{
        type: Boolean,
        default: false
    },
    profilePicture:{
        type: String
    },
    dateOfPre:{
        type: Date
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;