import express from 'express';
import Problem from '../models/problem.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();


router.post('/', verifyToken, async(req, res)=> {
    const {title, description, inputFormat, outputFormat, difficulty, testCases} = req.body;
    if(!title || !description) {
        return res.status(400).json({error: "Title and description are required"});
    }

    try{
        const newProblem = await new Problem({title, description, inputFormat, outputFormat, difficulty, testCases});
        await newProblem.save();
        res.status(201).json({msg: "Problem saved succesfully", problem: newProblem});

    }
    catch(error){
        console.error('Error adding problems');
        res.status(500).json({error: "Server error"});
    }
});


router.get('/', verifyToken, async (req, res) => {
    try{
        const problems = await Problem.find({}, 'title difficulty');
        res.json(problems);
    }
    catch(error){
        res.status(500).json({error: 'Failed to fetch the problems'});
    }
});

router.get('/:id', verifyToken, async(req, res) => {
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

export default router;