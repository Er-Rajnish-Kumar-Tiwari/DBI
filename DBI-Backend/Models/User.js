const mongoose = require("mongoose");

// Identity is keyed by email only — a returning email always logs in
// to the same record even if the name typed this time is different.
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
