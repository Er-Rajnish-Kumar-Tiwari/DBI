const express = require("express");
const { login } = require("../Controlls/AuthController");

const authRouter = express.Router();

authRouter.post("/login", login);

module.exports = authRouter;
