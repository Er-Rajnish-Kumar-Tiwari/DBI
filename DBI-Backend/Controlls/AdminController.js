const User = require("../Models/User");
const Message = require("../Models/Message");

// List every user with a quick summary — message count and last activity —
// so the dashboard can render the full user list at a glance.
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).lean();

        const summaries = await Promise.all(
            users.map(async (user) => {
                const [messageCount, lastMessage] = await Promise.all([
                    Message.countDocuments({ user: user._id }),
                    Message.findOne({ user: user._id }).sort({ createdAt: -1 }).lean(),
                ]);

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    joinedAt: user.createdAt,
                    messageCount,
                    lastActiveAt: lastMessage ? lastMessage.createdAt : user.createdAt,
                };
            })
        );

        return res.status(200).json({ success: true, users: summaries });
    } catch (error) {
        console.error("Admin getUsers error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to load users" });
    }
};

// Full chat history for a single user, for the admin dashboard's detail view.
const getUserMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const messages = await Message.find({ user: userId })
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email },
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
                timestamp: m.createdAt,
            })),
        });
    } catch (error) {
        console.error("Admin getUserMessages error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to load chat history" });
    }
};

module.exports = { getUsers, getUserMessages };
