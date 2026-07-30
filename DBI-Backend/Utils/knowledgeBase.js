const path = require("path");
const mammoth = require("mammoth");

const DOCX_PATH = path.join(
    __dirname,
    "..",
    "DBI_Complete_Knowledge_Base_For_AI_Training.docx"
);

let cachedText = null;

// Extracted once and cached in memory since the doc is static per deployment.
const loadKnowledgeBase = async () => {
    if (cachedText !== null) return cachedText;

    try {
        const result = await mammoth.extractRawText({ path: DOCX_PATH });
        cachedText = result.value.replace(/\n{3,}/g, "\n\n").trim();
        console.log(`DBI knowledge base loaded (${cachedText.length} characters)`);
    } catch (error) {
        console.error("Failed to load DBI knowledge base:", error.message);
        cachedText = "";
    }

    return cachedText;
};

module.exports = { loadKnowledgeBase };
