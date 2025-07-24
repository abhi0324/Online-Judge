// middlewares/verifyAdmin.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const verifyAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
};

export default verifyAdmin;
