const mongoose = require("mongoose");

// Per-user chat history, shown back to the user on their next login
// and visible to the admin dashboard.
const messageSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
