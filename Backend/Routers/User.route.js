import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { register, login } from "../Controller/register.controller.js";
import User from "../Models/User.model.js";

const route = Router();

// Public routes
route.post("/register", register);
route.post("/login", login);

// Protected route - get current user
route.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default route;