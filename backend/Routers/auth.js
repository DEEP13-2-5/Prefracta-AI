import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const router = express.Router();

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return secret;
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const validateAuthPayload = ({ username, email, password }, isSignup = false) => {
    if (!email || typeof email !== "string") {
        return "Email is required";
    }

    if (!password || typeof password !== "string") {
        return "Password is required";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    if (isSignup) {
        if (!username || typeof username !== "string") {
            return "Username is required";
        }

        if (username.trim().length < 3) {
            return "Username must be at least 3 characters";
        }
    }

    return null;
};

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const validationError = validateAuthPayload({ username, email, password }, true);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const normalizedEmail = normalizeEmail(email);
        const normalizedUsername = username.trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const existingUsername = await User.findOne({ username: normalizedUsername });
        if (existingUsername) return res.status(400).json({ error: "Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
            credits: 1, // Default 1 free credit
            subscription: { plan: "free" }
        });

        const savedUser = await newUser.save();

        // Generate token for auto-login
        const secret = getJwtSecret();

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
        if (err?.code === 11000) {
            return res.status(400).json({ error: "Email or username already exists" });
        }
        if (err.message === "JWT_SECRET is not configured") {
            return res.status(500).json({ error: "Server configuration error" });
        }
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const validationError = validateAuthPayload({ email, password }, false);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const normalizedEmail = normalizeEmail(email);
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(400).json({ error: "User not found" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        const secret = getJwtSecret();

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
        if (err.message === "JWT_SECRET is not configured") {
            return res.status(500).json({ error: "Server configuration error" });
        }
        res.status(500).json({ error: err.message });
    }
});

export default router;
