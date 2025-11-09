// Load environment variables
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory storage (replace with MongoDB later)
let users = [];

// Routes
app.post("/users", async (req, res) => {
  try {
    const newUser = {
      id: Date.now(),
      fullname: req.body.fullname,
      email: req.body.email,
      address: req.body.address,
      message: req.body.message,
      createdAt: new Date()
    };

    users.push(newUser);

    res.status(200).send({ 
      _message: "Successfully submitted", 
      data: newUser 
    });
  } catch (err) {
    res.status(400).send({ 
      _message: "Failed submission", 
      error: err.message 
    });
  }
});

app.get("/users", (req, res) => {
  res.json(users);
});

// Basic routes
app.get("/api/hello", (req, res) => { 
  res.json({ msg: "Backend API is running!" });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: "In-memory storage",
    timestamp: new Date().toISOString()
  });
});

// Start server without MongoDB
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/users`);
  console.log(`💡 Note: Using in-memory storage (data resets on restart)`);
});