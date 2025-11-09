// Load environment variables
import express from "express";
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const user_router = require("./Routes/users");
app.use("/users", user_router);


// Basic routes
app.get("/api/hello", (req, res) =>{ res.json({ msg: "Backend API is running!" });});


app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio-db")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`👥 Users API: http://localhost:${PORT}/users`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });