const express = require("express");
const adminAuth = require("../Middleware/adminAuth");
const { getUsers, getUserConversations, getConversationMessages } = require("../Controlls/AdminController");

const adminRouter = express.Router();

adminRouter.use(adminAuth);
adminRouter.get("/users", getUsers);
adminRouter.get("/users/:userId/conversations", getUserConversations);
adminRouter.get("/conversations/:conversationId/messages", getConversationMessages);

module.exports = adminRouter;
