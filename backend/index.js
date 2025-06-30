import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/auth.js';
import protectedroutes from './routes/protected.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', router);
app.use('/api/protected', protectedroutes);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("MongoDB error", error);
    }
}

connectDB();

app.get('/', (req,res) => {
    res.send("Welcome to online judge backend");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=> {
    console.log("Server running on port 8000");
});