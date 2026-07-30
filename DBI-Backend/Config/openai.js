const OpenAI = require("openai");

const baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";

// Primary Gemini key, with an optional secondary key used as a fallback
// when the primary one hits rate limits/quota errors.
const primaryClient = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL,
});

const secondaryClient = process.env.GEMINI_API_KEY_2
    ? new OpenAI({ apiKey: process.env.GEMINI_API_KEY_2, baseURL })
    : null;

module.exports = { primaryClient, secondaryClient };
