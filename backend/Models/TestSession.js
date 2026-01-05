import mongoose from "mongoose";

const testSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: String,
    metrics: mongoose.Schema.Types.Mixed, // Stores parsed k6 metrics
    charts: mongoose.Schema.Types.Mixed,  // Stores chart data
    github: mongoose.Schema.Types.Mixed,  // Stores GitHub analysis
    ai: {
        message: String
    },
    chatHistory: [{
        role: String,
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("TestSession", testSessionSchema);
