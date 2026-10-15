import mongoose from "mongoose";

const testSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: String,
    metrics: mongoose.Schema.Types.Mixed, // Stores parsed k6 metrics
    browserMetrics: mongoose.Schema.Types.Mixed, // Stores Playwright audit results
    frontendAudit: mongoose.Schema.Types.Mixed,
    securityAudit: mongoose.Schema.Types.Mixed,
    scanAuthorization: mongoose.Schema.Types.Mixed,
    charts: mongoose.Schema.Types.Mixed,  // Stores chart data
    healthData: mongoose.Schema.Types.Mixed, // Stores pie chart health distribution
    github: mongoose.Schema.Types.Mixed,  // Stores GitHub analysis
    ai: mongoose.Schema.Types.Mixed,      // Stores flexible AI output (message, verdict, etc)
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
