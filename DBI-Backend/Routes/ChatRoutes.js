const express = require("express");
const { sendMessage } = require("../Controlls/ChatController");

const chatRouter = express.Router();

chatRouter.post("/message", sendMessage);

module.exports = chatRouter;
