import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../Models/User.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Helper to get keys with safe fallbacks
const getRazorpayKeys = () => {
    const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    const finalKeyId = keyId !== "" ? keyId : "rzp_test_dummy_key";
    const finalKeySecret = keySecret !== "" ? keySecret : "dummy_secret";

    return { finalKeyId, finalKeySecret };
};

const { finalKeyId: initKey, finalKeySecret: initSecret } = getRazorpayKeys();
const razorpay = new Razorpay({
    key_id: initKey,
    key_secret: initSecret,
});

// PLANS (Static for now, could be in DB)
const PLANS = {
    weekly: { amount: 49900, currency: "INR", days: 7 }, // 499.00 INR
    monthly: { amount: 149900, currency: "INR", days: 30 }, // 1499.00 INR
};

/**
 * Initialize Payment
 */
router.post("/create-sub", async (req, res) => {
    try {
        const { planType } = req.body; // 'weekly' or 'monthly'
        if (!PLANS[planType]) return res.status(400).json({ error: "Invalid plan type" });

        const options = {
            amount: PLANS[planType].amount,
            currency: PLANS[planType].currency,
            receipt: `receipt_sub_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
                planType: planType,
            },
        };

        const { finalKeyId } = getRazorpayKeys();
        const order = await razorpay.orders.create(options);

        console.log(`💳 Payment Order Created: ${order.id} for user ${req.user._id}`);
        console.log(`🔑 Sending Razorpay Key to Frontend: ${finalKeyId.substring(0, 10)}...`);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            razorpayKeyId: finalKeyId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Verify Payment & Update Subscription
 */
router.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;

        const { finalKeySecret } = getRazorpayKeys();
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", finalKeySecret)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Payment Successful

            const user = await User.findById(req.user._id);

            // Calculate Expiry
            const daysToAdd = PLANS[planType].days;
            const newExpiry = new Date();
            newExpiry.setDate(newExpiry.getDate() + daysToAdd);

            user.subscription.plan = planType;
            user.subscription.expiry = newExpiry;
            user.subscription.razorpaySubscriptionId = razorpay_order_id; // saving order id as ref

            await user.save();

            res.json({
                success: true,
                message: "Subscription activated",
                user: {
                    username: user.username,
                    email: user.email,
                    credits: user.credits,
                    totalTests: user.totalTests || 0,
                    subscription: {
                        ...user.subscription,
                        daysLeft: Math.max(0, Math.ceil((new Date(user.subscription.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                    }
                }
            });
        } else {
            res.status(400).json({ error: "Invalid Signature" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
