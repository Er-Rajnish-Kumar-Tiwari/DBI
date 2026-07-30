const mongoose = require("mongoose");

// Anonymous log of Q&A pairs for the developer's own analytics.
// Not tied to any user and never exposed through an API.
const chatLogSchema = new mongoose.Schema(
    {
        message: { type: String, required: true },
        reply: { type: String, required: true },
        language: { type: String, default: "auto" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ChatLog", chatLogSchema);
