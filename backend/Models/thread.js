// thread - 1 sequence of chat is know as thread , or like taking to chatgpt whole reply and message ... etc , is know as thread
//threadSchema -> thread-id.+ title - in , role -  user / ai , (hi - user , how can i help - Ai),time stamp (created at and update at)

//2nd message schema content , role , timestamp 

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const threadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    default: "New chat",
  },

  messages: [messageSchema],

  hasDefaultReply: {
    type: Boolean,
    default: false,
  },

  CreatedAt: {
    type: Date,
    default: Date.now,
  },

  UpdatedAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Thread", threadSchema);
