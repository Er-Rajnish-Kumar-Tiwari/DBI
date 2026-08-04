const express = require("express");
const adminAuth = require("../Middleware/adminAuth");
const { getUsers, getUserMessages } = require("../Controlls/AdminController");

const adminRouter = express.Router();

adminRouter.use(adminAuth);
adminRouter.get("/users", getUsers);
adminRouter.get("/users/:userId/messages", getUserMessages);

module.exports = adminRouter;
