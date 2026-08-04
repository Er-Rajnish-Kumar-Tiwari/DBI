const User = require("../Models/User");
const Message = require("../Models/Message");
const Conversation = require("../Models/Conversation");

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

// A single user's chat threads (newest first), so the admin can drill down
// into one conversation at a time instead of one giant merged history.
const getUserConversations = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const conversations = await Conversation.find({ user: userId })
            .sort({ updatedAt: -1 })
            .lean();

        const summaries = await Promise.all(
            conversations.map(async (c) => ({
                id: c._id,
                title: c.title,
                updatedAt: c.updatedAt,
                messageCount: await Message.countDocuments({ conversation: c._id }),
            }))
        );

        return res.status(200).json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email },
            conversations: summaries,
        });
    } catch (error) {
        console.error("Admin getUserConversations error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to load chat threads" });
    }
};

// Full message history for a single chat thread.
const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId).lean();
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        const messages = await Message.find({ conversation: conversationId })
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            conversation: { id: conversation._id, title: conversation.title },
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
                timestamp: m.createdAt,
            })),
        });
    } catch (error) {
        console.error("Admin getConversationMessages error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to load chat history" });
    }
};

module.exports = { getUsers, getUserConversations, getConversationMessages };
