const { primaryClient, secondaryClient } = require("../Config/openai");
const { loadKnowledgeBase } = require("../Utils/knowledgeBase");
const ChatLog = require("../Models/ChatLog");

const MODEL = "gemini-2.5-flash";
const MAX_HISTORY = 12;

const LANGUAGE_HINT = {
    en: "Reply in English only.",
    hi: "Reply in Hindi only (Devanagari script).",
    auto: "Reply in the same language the user just wrote in (English, Hindi, or Hinglish) — mirror their style.",
};

const buildSystemPrompt = (knowledgeBase, lang) => `You are DBI Bot, the official support assistant for "Digital Book of India" (DBI) — an AI-driven business directory and digital ecosystem platform for the Indian market, positioned as "Building India's Business OS."

Your job:
- Answer user questions about DBI (the platform, its features, pricing, registration, plans, etc.) helpfully and accurately.
- Use the KNOWLEDGE BASE below as your primary and most trustworthy source. Prefer it over anything else you know whenever it covers the topic.
- If the knowledge base doesn't cover something the user asked, you may use your own general knowledge to give the best possible helpful answer — but never contradict the knowledge base, and keep it clearly related to DBI/business/support context.
- ${LANGUAGE_HINT[lang] || LANGUAGE_HINT.auto}
- Keep answers concise and conversational, like a helpful support agent — short paragraphs or bullet points, no unnecessary headers, no walls of text.
- If a question is completely unrelated to DBI and general assistance isn't reasonable, politely steer the conversation back to how you can help with Digital Book of India.

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
        const { message, history, lang } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
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

        return res.status(200).json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error("Chat error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again in a moment.",
        });
    }
};

module.exports = { sendMessage };
