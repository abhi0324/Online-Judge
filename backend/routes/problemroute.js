import express from 'express';
import Problem from '../models/problem.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const router = express.Router();


router.post('/', verifyToken, verifyAdmin, async(req, res)=> {
    const {title, description, inputFormat, outputFormat, constraints , difficulty, examples ,testCases} = req.body;
    if(!title || !description) {
        return res.status(400).json({error: "Title and description are required"});
    }

    try{
        const newProblem = await new Problem({title, description, inputFormat, outputFormat, constraints , examples, difficulty, testCases});
        await newProblem.save();
        res.status(201).json({msg: "Problem saved succesfully", problem: newProblem});

    }
    catch(error){
        console.error('Error adding problems');
        res.status(500).json({error: "Server error"});
    }
});


import jwt from 'jsonwebtoken';
import Submission from '../models/submission.js';

// GET /api/problems (Public with optional user auth status)
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find({}, 'title difficulty');

        // Check if user is logged in via token
        const authHeader = req.headers.authorization;
        let userId = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (e) {
                // Invalid or expired token, proceed as guest
                userId = null;
            }
        }

        if (!userId) {
            const problemsWithStatus = problems.map(p => ({
                ...p.toObject(),
                status: 'unsolved'
            }));
            return res.json(problemsWithStatus);
        }

        // Fetch user's submissions
        const submissions = await Submission.find({ userId }, 'problemId verdict');
        const solvedSet = new Set();
        const attemptedSet = new Set();

        submissions.forEach(sub => {
            if (!sub.problemId) return;
            const pIdStr = sub.problemId.toString();
            if (sub.verdict && sub.verdict.toLowerCase().includes('accepted')) {
                solvedSet.add(pIdStr);
            } else {
                attemptedSet.add(pIdStr);
            }
        });

        const problemsWithStatus = problems.map(p => {
            const pIdStr = p._id.toString();
            let status = 'unsolved';
            if (solvedSet.has(pIdStr)) {
                status = 'solved';
            } else if (attemptedSet.has(pIdStr)) {
                status = 'attempted';
            }
            return {
                ...p.toObject(),
                status
            };
        });

        res.json(problemsWithStatus);
    }
    catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ error: 'Failed to fetch the problems' });
    }
});

// GET /api/problems/:id (Public)
router.get('/:id', async(req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        if(!problem){
            return res.status(404).json({error: 'Problem not found'});
        }
        res.json(problem);
    }
    catch (error){
        res.status(500).json({error: 'Failed to fetch problem'});
    }
});

router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try{
        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        if(!updatedProblem){
            return res.status(404).json({error: 'Problem not found'});
        }

        res.json({msg: 'Problem updated succesfully', problem: updatedProblem});
    }
    catch(error){
        res.status(500).json({error: 'Failed to update problem'});
    }
});

router.delete('/:id', verifyToken,verifyAdmin, async(req, res) => {
    try{
        const deleted = await Problem.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.staus(404).json({error: 'Problem not found'});
        }
        res.json({msg: 'Problem deleted succesfully'});
    }
    catch(error){
        res.status(500).json({error: 'Failed to delete problem'});
    }
})

export default router;