import express from "express";
const router = express.Router();

// Temporary in-memory storage
let users = [];

// Create User
router.post("/", async (req, res) => {
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

// Get all users
router.get("/", (req, res) => {
  res.json(users);
});

export default router;