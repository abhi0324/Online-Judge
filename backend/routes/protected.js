import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/secret', verifyToken ,(req, res) => {
    res.json({
        msg: "Wecome to this protected route", 
        user: req.user
    })
})

export default router;