import jwt from "jsonwebtoken";
import User from "../Models/User.js";

/**
 * Protects routes and populates req.user
 */
export const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.log("❌ Auth failed: No Authorization header");
        return res.status(401).json({ error: "Access Denied" });
    }

    // Aggressive cleaning: Remove "Bearer ", quotes, and whitespace
    // Handles: 'Bearer token', 'Bearer "token"', '"token"', etc.
    let token = authHeader.replace(/^Bearer\s+/i, "").replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();

    try {
        const secret = process.env.JWT_SECRET || "fallback_secret_key";
        const verified = jwt.verify(token, secret);
        const user = await User.findById(verified.id).select("-password");

        if (!user) return res.status(401).json({ error: "User not found" });

        // Auto-reset expired subscriptions to free plan
        if (user.subscription.plan !== "free" && user.subscription.expiry) {
            const now = new Date();
            const expiryDate = new Date(user.subscription.expiry);

            if (now >= expiryDate) {
                user.subscription.plan = "free";
                user.subscription.expiry = null;
                await user.save();
            }
        }

        // Calculate daysLeft for response
        let daysLeft = 0;
        if (user.subscription.plan !== "free" && user.subscription.expiry) {
            const diff = new Date(user.subscription.expiry).getTime() - new Date().getTime();
            daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        }

        req.user = user;
        req.daysLeft = daysLeft;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

/**
 * Checks if user has credits or active subscription
 */
export const checkCreditsOrSub = async (req, res, next) => {
    try {
        const user = req.user;

        // 1. Check if subscription is valid and NOT expired
        if (user.subscription.plan !== "free" && user.subscription.expiry) {
            const now = new Date();
            const expiryDate = new Date(user.subscription.expiry);

            // Calculate days left
            const daysLeft = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

            // If subscription expired (0 days or past expiry date)
            if (daysLeft === 0 || now >= expiryDate) {
                // Reset to free plan
                user.subscription.plan = "free";
                user.subscription.expiry = null;
                await user.save();

                return res.status(403).json({
                    error: "Subscription expired. Please renew to continue.",
                    expired: true
                });
            }

            // Subscription is still active
            if (req.originalUrl.includes("load-test") || req.originalUrl.includes("github-test")) {
                user.totalTests = (user.totalTests || 0) + 1;
                await user.save();
            }
            return next();
        }

        // 2. If 'free' or expired, check credits
        if (user.credits > 0) {
            user.credits -= 1;

            // Increment totalTests for testing routes
            if (req.originalUrl.includes("load-test") || req.originalUrl.includes("github-test")) {
                user.totalTests = (user.totalTests || 0) + 1;
            }

            await user.save();
            return next();
        }

        return res.status(403).json({
            error: "Quota exceeded. Upgrade to Weekly/Monthly plan."
        });

    } catch (err) {
        console.error(`❌ Auth Check Error: ${err.message}`);
        res.status(500).json({ error: "Auth Check Failed" });
    }
};
