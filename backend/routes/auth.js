import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();


// POST /api/auth/register
router.post('/register', async (req, res) =>{
    const {username, email, password} = req.body;
    try {
        // check if email already exits
        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({error: 'Email already registered'});
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // savve user
        const isAdmin = (email == 'admin0324@gmail.com');
        const newUser = new User({username, email, password: hashed, isAdmin});
        await newUser.save();

        res.status(201).json({msg: 'User registered succesfully'});
    }
    
    catch(error) {
        res.status(500).json({error: 'Registration failed'});
    }
});


// POST /api/auth/login
router.post('/login', async (req, res) =>{
    const {email, password} = req.body;

    //console.log('Login attempt with: ', email, password);

    try {
        // 1. Check if user exists
        const user = await User.findOne({email});
        if(!user){
            //console.log('User not found for email', email);
            return res.status(400).json({error: "Invalid email or password"});
        }

        // 2. Check if password is correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            //console.log('Password Match?', isMatch);
            return res.status(400).json({error: "Invalid email or password"});
        }

        // 3. Create JWT token 
        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '2h'}
        );


        // 4.Send token and User info
        res.status(200).json({msg: 'Login Succesful', token, 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            }
        });
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Login failed'});
    }
});


export default router;
