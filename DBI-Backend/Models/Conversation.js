const mongoose = require("mongoose");

// One "New Chat" thread — groups a run of messages together so a user's
// past chats show up as separate, reopenable conversations (like ChatGPT).
const conversationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        title: { type: String, default: "New Chat" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
