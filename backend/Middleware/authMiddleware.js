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
        console.log(`🔍 Verifying Token: ${token.substring(0, 10)}... using secret: ${secret.substring(0, 3)}***`);

        const verified = jwt.verify(token, secret);
        console.log(`✅ Token Verified for ID: ${verified.id}`);

        const user = await User.findById(verified.id).select("-password");
        if (!user) {
            console.log(`❌ Auth failed: User ${verified.id} not found in DB`);
            return res.status(401).json({ error: "User not found" });
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
        console.log(`❌ Auth failed: JWT verify error: ${err.message}`);
        res.status(400).json({ error: "Invalid Token" });
    }
};

/**
 * Checks if user has credits or active subscription
 */
export const checkCreditsOrSub = async (req, res, next) => {
    try {
        const user = req.user;
        console.log(`💳 Checking Credits for User: ${user.username} (${user.credits} credits)`);

        // 1. Check if subscription is valid
        if (user.subscription.plan !== "free" && user.subscription.expiry) {
            console.log(`📅 Checking Subscription: ${user.subscription.plan}`);
            if (new Date() < new Date(user.subscription.expiry)) {
                console.log("✅ Valid Subscription Found");

                // Increment totalTests even for unlimited plans
                if (req.originalUrl.includes("load-test") || req.originalUrl.includes("github-test")) {
                    user.totalTests = (user.totalTests || 0) + 1;
                    await user.save();
                    console.log(`📈 Activity tracked for subscriber: ${user.username}`);
                }

                return next(); // Valid subscription
            }
        }

        // 2. If 'free' or expired, check credits
        if (user.credits > 0) {
            console.log("📉 Deducting 1 Credit...");
            user.credits -= 1;

            // Increment totalTests for testing routes
            if (req.originalUrl.includes("load-test") || req.originalUrl.includes("github-test")) {
                user.totalTests = (user.totalTests || 0) + 1;
            }

            console.log("💾 Saving user status...");
            await user.save();
            console.log("✅ User status saved. Proceeding...");
            return next();
        }

        console.log("❌ Quota Exceeded");
        return res.status(403).json({
            error: "Quota exceeded. Upgrade to Weekly/Monthly plan."
        });

    } catch (err) {
        console.log(`❌ Error in checkCreditsOrSub: ${err.message}`);
        res.status(500).json({ error: "Auth Check Failed" });
    }
};
