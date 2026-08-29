import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        require: true,
        unique: true,
    },

    password: {
        type: String,
        require: false,
    },
    googleId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;