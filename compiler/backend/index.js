import express from 'express';
import dotenv from 'dotenv';
import router from './routes/run.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/run', router);
app.get('/', (req,res) => {
    res.send('Welcome to Online complier backend');
});



const PORT = process.env.PORT || 8001;
app.listen(PORT, ()=> {
    console.log("Server running on port 8001");
})