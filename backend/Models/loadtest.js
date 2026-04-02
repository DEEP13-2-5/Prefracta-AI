import mongoose from "mongoose";

const loadTestSchema = new mongoose.Schema(
  {
    latency: {
      p50: { type: Number },
      p95: { type: Number },
      p99: { type: Number },
    },
    throughput: { type: Number },   // requests/sec
    errorRate: { type: Number },     // percentage
    vus: { type: Number },
    duration: { type: Number },      // seconds
  },
  { timestamps: true }
);

export default mongoose.model("LoadTest", loadTestSchema);
