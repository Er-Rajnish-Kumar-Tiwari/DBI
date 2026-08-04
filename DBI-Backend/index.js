require('dotenv').config();

const express = require("express");
const cors = require("cors");

const dbConnection = require("./Config/db");
const chatRouter = require("./Routes/ChatRoutes");
const authRouter = require("./Routes/AuthRoutes");
const adminRouter = require("./Routes/AdminRoutes");
const { loadKnowledgeBase } = require("./Utils/knowledgeBase");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => res.send("DBI Bot API is running"));

// Server
const PORT = process.env.PORT || 2000;

const start = async () => {
    dbConnection();
    await loadKnowledgeBase();

    app.listen(PORT, () =>
        console.log(`DBI Bot server running on port ${PORT}`)
    );
};

start();
