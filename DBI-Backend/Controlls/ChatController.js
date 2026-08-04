const { primaryClient, secondaryClient } = require("../Config/openai");
const { loadKnowledgeBase } = require("../Utils/knowledgeBase");
const ChatLog = require("../Models/ChatLog");
const Message = require("../Models/Message");
const Conversation = require("../Models/Conversation");

const TITLE_MAX_LEN = 60;
const titleFromMessage = (message) =>
    message.trim().length > TITLE_MAX_LEN
        ? `${message.trim().slice(0, TITLE_MAX_LEN)}…`
        : message.trim();

const MODEL = "gemini-flash-latest";
const MAX_HISTORY = 12;

const LANGUAGE_HINT = {
    en: "Reply in English only.",
    hi: "Reply in Hindi only (Devanagari script).",
    auto: "Reply in the same language the user just wrote in (English, Hindi, or Hinglish) — mirror their style.",
};

const buildSystemPrompt = (knowledgeBase, lang) => `You are DBI Bot, the official support assistant for "Digital Book of India" (DBI) — an AI-driven business directory and digital ecosystem platform for the Indian market, positioned as "Building India's Business OS."

Your job:
- Answer user questions about DBI (the platform, its features, pricing, registration, plans, etc.) helpfully and accurately.
- Use the KNOWLEDGE BASE below as your primary and most trustworthy source for anything about DBI. Prefer it over anything else you know whenever it covers the topic, and never contradict it.
- If the knowledge base does NOT cover what the user asked — whether it's a DBI detail it's missing or a completely general/unrelated question (general knowledge, coding, math, current events, etc.) — always answer it yourself using your own broad knowledge, just like a normal AI assistant would. Never refuse and never say you don't know just because it's outside the knowledge base or outside DBI's topic — only the "DBI" answers must come from the knowledge base, everything else you answer normally.
- ${LANGUAGE_HINT[lang] || LANGUAGE_HINT.auto}
- Keep answers concise and conversational, like a helpful support agent — short paragraphs or bullet points, no unnecessary headers, no walls of text.

--- KNOWLEDGE BASE START ---
${knowledgeBase || "(Knowledge base could not be loaded — answer using general best judgement and mention DBI support can be contacted for exact details.)"}
--- KNOWLEDGE BASE END ---`;

const askModel = async (messages) => {
    try {
        return await primaryClient.chat.completions.create({
            model: MODEL,
            messages,
        });
    } catch (error) {
        if (secondaryClient) {
            console.warn("Primary Gemini key failed, retrying with secondary key:", error.message);
            return await secondaryClient.chat.completions.create({
                model: MODEL,
                messages,
            });
        }
        throw error;
    }
};

const sendMessage = async (req, res) => {
    try {
        const { message, history, lang, userId, conversationId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        // A message with no conversationId starts a brand-new chat thread —
        // this must happen before we reply so the id can go back to the client.
        let activeConversationId = conversationId || null;
        if (userId && !activeConversationId) {
            const conversation = await Conversation.create({
                user: userId,
                title: titleFromMessage(message),
            });
            activeConversationId = conversation._id;
        }

        const knowledgeBase = await loadKnowledgeBase();
        const systemPrompt = buildSystemPrompt(knowledgeBase, lang);

        const trimmedHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY) : [];

        const messages = [
            { role: "system", content: systemPrompt },
            ...trimmedHistory
                .filter((m) => m && m.content)
                .map((m) => ({
                    role: m.role === "assistant" ? "assistant" : "user",
                    content: m.content,
                })),
            { role: "user", content: message },
        ];

        const completion = await askModel(messages);
        const content = completion?.choices?.[0]?.message?.content;

        if (!content) {
            return res.status(502).json({
                success: false,
                message: "AI response failed, please try again.",
            });
        }

        const reply = {
            role: "assistant",
            content,
            timestamp: Date.now(),
        };

        // Fire-and-forget anonymous log; never blocks or breaks the chat response.
        ChatLog.create({ message, reply: content, language: lang || "auto" }).catch(() => {});

        // Fire-and-forget per-user history, when the request came from a logged-in user.
        if (userId && activeConversationId) {
            Message.insertMany([
                { user: userId, conversation: activeConversationId, role: "user", content: message },
                { user: userId, conversation: activeConversationId, role: "assistant", content },
            ]).catch(() => {});

            Conversation.updateOne({ _id: activeConversationId }, {}).catch(() => {});
        }

        return res.status(200).json({
            success: true,
            reply,
            conversationId: activeConversationId,
        });
    } catch (error) {
        console.error("Chat error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again in a moment.",
        });
    }
};

// Lists a logged-in user's past chat threads (newest first), for the sidebar.
const listConversations = async (req, res) => {
    try {
        const { userId } = req.params;

        const conversations = await Conversation.find({ user: userId })
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            conversations: conversations.map((c) => ({
                id: c._id,
                title: c.title,
                updatedAt: c.updatedAt,
            })),
        });
    } catch (error) {
        console.error("List conversations error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to load chat history" });
    }
};

// Returns the messages of a single chat thread, so reopening it shows exactly
// that conversation instead of every chat mixed together.
const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversation: conversationId })
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
                timestamp: m.createdAt,
            })),
        });
    } catch (error) {
        console.error("Get conversation messages error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to load chat history" });
    }
};

module.exports = { sendMessage, listConversations, getConversationMessages };
