const express = require("express");
const { sendMessage, listConversations, getConversationMessages } = require("../Controlls/ChatController");

const chatRouter = express.Router();

chatRouter.post("/message", sendMessage);
chatRouter.get("/conversations/:userId", listConversations);
chatRouter.get("/conversations/:conversationId/messages", getConversationMessages);

module.exports = chatRouter;
