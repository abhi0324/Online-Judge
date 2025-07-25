import express from "express";

import { runGemini } from "../utils/gemini.js";
import Problem from "./problemroute.js";
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res)=> {
    try{
        const { code } = req.body;
        const result = await runGemini(code);
        return res.json({response: result});
    }
    catch(error){
        return res.status(500).json("Error while calling gemini api", error);
    }
});

export default router;


