import express from "express";
import User from "../MongoDB/model.js";

const router = express.Router();

// Enhanced Create User (MongoDB)
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received form data:", {
      fullname: req.body.fullname,
      email: req.body.email,
      address: req.body.address ? `${req.body.address.substring(0, 30)}...` : 'empty',
      message: req.body.message ? `${req.body.message.substring(0, 50)}...` : 'empty'
    });

    // Validate required fields
    const { fullname, email, address, message } = req.body;
    
    if (!fullname || !email || !address || !message) {
      return res.status(400).json({ 
        success: false,
        _message: "Failed submission", 
        error: "All fields are required: fullname, email, address, message" 
      });
    }

    // Trim and validate input lengths
    const trimmedFullname = fullname.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedAddress = address.trim();
    const trimmedMessage = message.trim();

    if (trimmedFullname.length < 2) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Full name must be at least 2 characters long"
      });
    }

    if (trimmedFullname.length > 100) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Full name cannot exceed 100 characters"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Please provide a valid email address"
      });
    }

    if (trimmedEmail.length > 255) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Email cannot exceed 255 characters"
      });
    }

    if (trimmedAddress.length < 5) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Address must be at least 5 characters long"
      });
    }

    if (trimmedAddress.length > 500) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Address cannot exceed 500 characters"
      });
    }

    if (trimmedMessage.length < 10) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Message must be at least 10 characters long"
      });
    }

    if (trimmedMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Message cannot exceed 2000 characters"
      });
    }

    // COMMENTED OUT: 24-hour restriction for testing
    // Check for duplicate submissions (same email within last 24 hours)
    /*
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingSubmission = await User.findOne({
      email: trimmedEmail,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        _message: "Failed submission",
        error: "You have already submitted a message recently. Please wait 24 hours before submitting again."
      });
    }
    */

    const newUser = new User({
      fullname: trimmedFullname,
      email: trimmedEmail,
      address: trimmedAddress,
      message: trimmedMessage
    });

    const savedUser = await newUser.save();
    
    console.log("✅ User saved to MongoDB Atlas:", {
      id: savedUser._id,
      email: savedUser.email,
      timestamp: savedUser.createdAt,
      database: "aditya-protfolio"
    });

    res.status(201).json({ 
      success: true,
      _message: "Successfully submitted! Your message has been saved permanently in MongoDB Atlas database.", 
      message: "Thank you for contacting me! I'll get back to you soon.",
      data: savedUser.getSummary(),
      id: savedUser._id,
      timestamp: savedUser.createdAt,
      database: "aditya-protfolio"
    });
  } catch (err) {
    console.error("❌ Error saving to MongoDB:", err);
    
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        _message: "Failed submission", 
        error: "This email has already been used for submission." 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false,
        _message: "Failed submission", 
        error: "Validation failed",
        details: errors
      });
    }

    // Handle CastError (invalid ID)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        _message: "Failed submission",
        error: "Invalid data format"
      });
    }

    res.status(500).json({ 
      success: false,
      _message: "Failed submission", 
      error: "Internal server error. Please try again later." 
    });
  }
});

// Get all users (MongoDB) - For testing and admin
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const users = await User.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments();
    
    console.log(`📊 Found ${users.length} users in database (Total: ${total})`);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      totalCount: total,
      database: "aditya-protfolio"
    });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch users",
      message: err.message 
    });
  }
});

// Get user count - For testing
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ 
      success: true,
      count,
      message: `Total submissions in aditya-protfolio database: ${count}`,
      database: "aditya-protfolio"
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }
    
    res.json({
      success: true,
      data: user,
      database: "aditya-protfolio"
    });
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
      message: err.message
    });
  }
});

// Get recent submissions
router.get("/api/recent", async (req, res) => {
  try {
    const recentUsers = await User.getRecentSubmissions(5);
    res.json({
      success: true,
      data: recentUsers.map(user => user.getSummary()),
      count: recentUsers.length,
      database: "aditya-protfolio"
    });
  } catch (err) {
    console.error("❌ Error fetching recent submissions:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recent submissions"
    });
  }
});

export default router;