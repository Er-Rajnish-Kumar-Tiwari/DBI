const User = require("../Models/User");

// Identity is keyed by email: a known email always logs in (even if the
// name typed this time is different), an unknown email always signs up.
// The one exception is the admin email from .env, where BOTH the name and
// the email must match exactly before admin access is granted.
const login = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !name.trim() || !email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();

        const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
        const adminName = (process.env.ADMIN_NAME || "").trim().toLowerCase();

        if (adminEmail && normalizedEmail === adminEmail) {
            if (normalizedName.toLowerCase() !== adminName) {
                return res.status(401).json({
                    success: false,
                    message: "Admin email recognized, but the name doesn't match. Please enter the correct admin name.",
                });
            }

            return res.status(200).json({
                success: true,
                isAdmin: true,
                isNew: false,
                user: {
                    name: process.env.ADMIN_NAME,
                    email: process.env.ADMIN_EMAIL,
                },
            });
        }

        let user = await User.findOne({ email: normalizedEmail });
        let isNew = false;

        if (!user) {
            user = await User.create({ name: normalizedName, email: normalizedEmail });
            isNew = true;
        } else if (user.name !== normalizedName) {
            user.name = normalizedName;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            isAdmin: false,
            isNew,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Auth error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again in a moment.",
        });
    }
};

module.exports = { login };
