import express from 'express';
import Submission from "../models/submission.js";
import User from "../models/user.js";
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/',verifyToken, async (req, res) => {
    try {
        const data = await Submission.aggregate([
            { $match: { verdict: "Accepted" } },
            {
                $group: {
                    _id: { user: "$userId", problem: "$problemId" }
                }
            },
            {
                $group: {
                    _id: "$_id.user", 
                    solved: { $sum: 1 } 
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    username: "$user.username",
                    solved: 1
                }
            },
            { $sort: { solved: -1 } }
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Leaderboard fetch failed", detail: err });
    }
});

export default router;
