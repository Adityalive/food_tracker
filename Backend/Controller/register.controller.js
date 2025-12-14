import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.model.js";
import auth from "../middleware/auth.middleware.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Already registered, please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    await newUser.save();
    return res.status(200).json({ message: "Successfully registered" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", token });
};