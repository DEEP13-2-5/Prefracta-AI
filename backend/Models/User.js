import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        default: 1, // Free tier starts with 1 credit
    },
    subscription: {
        plan: {
            type: String,
            enum: ["free", "weekly", "monthly"],
            default: "free",
        },
        expiry: {
            type: Date,
            default: null,
        },
        razorpayCustomerId: String,
        razorpaySubscriptionId: String,
    },
    totalTests: {
        type: Number,
        default: 0,
    },
    lastSessionId: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("User", userSchema);
