const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
};

module.exports = dbConnection;
