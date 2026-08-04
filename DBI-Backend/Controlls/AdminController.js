const User = require("../Models/User");
const Message = require("../Models/Message");
const Conversation = require("../Models/Conversation");

// Every user with their chat threads embedded, newest chat first — the
// dashboard sidebar renders this in one shot as "user card -> chat titles".
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).lean();

        const summaries = await Promise.all(
            users.map(async (user) => {
                const conversations = await Conversation.find({ user: user._id })
                    .sort({ updatedAt: -1 })
                    .lean();

                const conversationSummaries = await Promise.all(
                    conversations.map(async (c) => ({
                        id: c._id,
                        title: c.title,
                        updatedAt: c.updatedAt,
                        messageCount: await Message.countDocuments({ conversation: c._id }),
                    }))
                );

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    joinedAt: user.createdAt,
                    conversations: conversationSummaries,
                };
            })
        );

        return res.status(200).json({ success: true, users: summaries });
    } catch (error) {
        console.error("Admin getUsers error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to load users" });
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

module.exports = { getUsers, getConversationMessages };
