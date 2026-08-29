import express from "express";
import rateLimit from "express-rate-limit";
import { runGemini, getGeminiHint } from "../utils/gemini.js";
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Rate limiter for AI Code Reviews: 10 requests per 15 minutes
const aiReviewLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "AI Review limit reached (max 10 requests per 15 mins). Please wait before requesting another review."
    }
});

// Rate limiter for AI Hints: 15 hints per 15 minutes
const aiHintLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "AI Hint limit reached (max 15 requests per 15 mins). Please try solving with the current hints first."
    }
});

// Full Code Review
router.post('/', verifyToken, aiReviewLimiter, async (req, res) => {
    try {
        const { code, language, problemTitle, problemDescription } = req.body;
        const result = await runGemini({ code, language, problemTitle, problemDescription });
        return res.json({ response: result });
    }
    catch (error) {
        console.error("Gemini route error:", error);
        return res.status(500).json({ error: "Error while calling Gemini API" });
    }
});

// 3-Tier AI Hint
router.post('/hint', verifyToken, aiHintLimiter, async (req, res) => {
    try {
        const { problemTitle, problemDescription, hintLevel, currentCode } = req.body;
        const hint = await getGeminiHint({
            problemTitle,
            problemDescription,
            hintLevel: Number(hintLevel) || 1,
            currentCode
        });
        return res.json({ hint });
    }
    catch (error) {
        console.error("Gemini Hint Error:", error);
        return res.status(500).json({ error: "Error generating AI hint" });
    }
});

export default router;
