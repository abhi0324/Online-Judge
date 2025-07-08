import express from 'express';
import Problem from '../models/problem.js';
import Submission from '../models/submission.js';
import verifyToken from '../middlewares/verifyToken.js';
import mongoose, { mongo } from 'mongoose';
import { executeCode } from '../utils/executecode.js';

const router = express.Router();


router.get('/', verifyToken, async(req, res) => {
    try{
        const submissions = await Submission.find({userId: req.user.id})
            .populate('problemId', 'title')
            .sort({submittedAt: -1});

        res.json(submissions);

    }
    catch(error) {
        console.log('Error fetching submisssion:', error);
        res.status(500).json({error: 'Failed to fetch submission'});
    }
});

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

        const testCases = problem.testCases;
        

        let verdict = 'Accepted';

        for(let testCase of testCases){
            try{
                const output = await executeCode(code, language, testCase.input);
                if(output.trim() != testCase.expectedOutput.trim()){
                    verdict = 'Wrong Answer';
                    break;
                }

            }
            catch(error){
                console.log("Runtime Error:", error); // Add this line
                verdict = 'Runtime Error';
                break;
            }
        }

        const submission = new Submission({
            userId : req.user.id,
            problemId,
            code,
            language,
            verdict,
        })

        await submission.save();
        
        return res.status(201).json({msg: verdict, submission});
    }
    catch(error) {
        console.error("Submission Error:", error.message);
        return res.status(500).json({error: 'Server error while submitting code'});
    }
});

export default router;
