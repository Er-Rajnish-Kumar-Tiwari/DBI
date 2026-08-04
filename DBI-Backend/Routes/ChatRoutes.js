const express = require("express");
const { sendMessage, getHistory } = require("../Controlls/ChatController");

const chatRouter = express.Router();

chatRouter.post("/message", sendMessage);
chatRouter.get("/history/:userId", getHistory);

module.exports = chatRouter;
