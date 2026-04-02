import mongoose from "mongoose";

const chartSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true, 
    // "latency" | "throughput" | "error"
  },

  labels: {
    type: [Number], // concurrent users
    required: true,
  },

  data: {
    type: [Number], // metric values
    required: true,
  },

  chartType: {
    type: String,
    enum: ["line", "area", "bar", "table"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Chart", chartSchema);
