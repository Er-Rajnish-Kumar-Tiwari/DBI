const express = require("express");
const adminAuth = require("../Middleware/adminAuth");
const { getUsers, getConversationMessages } = require("../Controlls/AdminController");

const adminRouter = express.Router();

adminRouter.use(adminAuth);
adminRouter.get("/users", getUsers);
adminRouter.get("/conversations/:conversationId/messages", getConversationMessages);

module.exports = adminRouter;
