import express from 'express';
import Problem from '../models/problem.js';
import Submission from '../models/submission.js';
import verifyToken from '../middlewares/verifyToken.js';
import mongoose, { mongo } from 'mongoose';

const router = express.Router();

router.post('/', verifyToken, async(req, res) => {
    const {code, language, problemId} = req.body;
    if(!code || !language || !problemId){
        return res.status(400).json({error: 'Code, language and problemId are required'});
    }

    if(!mongoose.Types.ObjectId.isValid(problemId)){
        return res.status(401).json({error: 'Invalid problemId format'});
    }

    try {
        const problem = await Problem.findById(problemId);
        if(!problem){
            return res.status(404).json({error: 'Problem not found'});
        }

        const submission = new Submission({
            userId : req.user.id,
            problemId,
            code,
            language,
            verdict: 'Pending'
        })

        await submission.save();
        
        res.status(201).json({msg: 'Submission recevied', submission});
    }
    catch(error) {
        console.error("Submission Error:", error.message);
        return res.status(500).json({error: 'Server error while submitting code'});
    }
});

export default router;
