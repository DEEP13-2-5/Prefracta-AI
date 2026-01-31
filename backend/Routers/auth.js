import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            credits: 1, // Default 1 free credit
            subscription: { plan: "free" }
        });

        const savedUser = await newUser.save();

        // Generate token for auto-login
        const secret = process.env.JWT_SECRET || "fallback_secret_key";

        const token = jwt.sign({ id: savedUser._id }, secret, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                username: savedUser.username,
                email: savedUser.email,
                credits: savedUser.credits,
                totalTests: savedUser.totalTests || 0,
                subscription: {
                    ...savedUser.subscription,
                    daysLeft: savedUser.subscription.plan !== "free" && savedUser.subscription.expiry
                        ? Math.max(0, Math.ceil((new Date(savedUser.subscription.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                        : 0
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        const secret = process.env.JWT_SECRET || "fallback_secret_key";

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                username: user.username,
                email: user.email,
                credits: user.credits,
                totalTests: user.totalTests || 0,
                subscription: {
                    ...user.subscription,
                    daysLeft: user.subscription.plan !== "free" && user.subscription.expiry
                        ? Math.max(0, Math.ceil((new Date(user.subscription.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                        : 0
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
