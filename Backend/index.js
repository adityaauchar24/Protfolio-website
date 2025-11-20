// Load environment variables and MongoDB connection
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import net from "net";
import connectDB from "./MongoDB/connection.js";
import userRoutes from "./Routes/users.js";

const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();

const DEFAULT_PORT = process.env.PORT || 4000;

// Function to check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
};

// Find available port
const findAvailablePort = async (startPort) => {
  let port = parseInt(startPort);
  const maxPort = port + 10;
  
  while (port <= maxPort) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    console.log(`⚠️  Port ${port} is busy, trying next port...`);
    port++;
  }
  
  throw new Error(`❌ No available ports found between ${startPort} and ${maxPort}`);
};

// Enhanced CORS configuration - Allow all origins for development
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001",
    "http://localhost:3002", 
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:5173", 
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3003",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://localhost:4173", // Vite preview
    "http://127.0.0.1:4173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: [
    "Content-Range",
    "X-Content-Range"
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enhanced request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} ${req.method} ${req.path}`, {
    ip: req.ip,
    origin: req.headers.origin,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Use user routes (MongoDB version)
app.use("/users", userRoutes);

// Add specific contact form endpoints with proper routing
app.use("/api/contact", userRoutes);
app.use("/contact", userRoutes);
app.use("/api/send-message", userRoutes);
app.use("/send-message", userRoutes);
app.use("/api/messages", userRoutes);
app.use("/api/submit", userRoutes);

// Enhanced health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    let userCount = 0;
    let databaseName = "Not connected";
    let databaseStats = {};
    
    if (dbStatus === "Connected") {
      databaseName = mongoose.connection.name || "aditya-protfolio";
      try {
        // Check if users collection exists and count documents
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const usersCollectionExists = collections.some(c => c.name === 'users');
        
        if (usersCollectionExists) {
          userCount = await db.collection('users').countDocuments();
        }
        
        // Get database statistics
        databaseStats = await db.stats();
      } catch (error) {
        console.log("⚠️ Could not count users:", error.message);
      }
    }
    
    res.json({ 
      status: "Server is running perfectly! 🚀",
      database: dbStatus,
      databaseName: databaseName,
      totalUsers: userCount,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      server: {
        port: process.env.SERVER_PORT || DEFAULT_PORT,
        nodeVersion: process.version,
        platform: process.platform
      },
      databaseStats: {
        collections: databaseStats.collections || 0,
        dataSize: databaseStats.dataSize || 0,
        storageSize: databaseStats.storageSize || 0
      },
      endpoints: {
        contact: [
          "POST /users",
          "POST /api/contact",
          "POST /contact", 
          "POST /api/send-message",
          "POST /send-message",
          "POST /api/messages",
          "POST /api/submit"
        ],
        getUsers: "GET /users",
        userCount: "GET /users/count",
        health: "GET /api/health",
        test: "GET /api/test"
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint for frontend connection testing
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is working correctly! ✅",
    timestamp: new Date().toISOString(),
    data: {
      server: "Express.js",
      database: "MongoDB Atlas",
      status: "Operational",
      connection: "aditya-protfolio database"
    }
  });
});

// Database connection test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    
    if (dbStatus !== "Connected") {
      return res.status(500).json({
        success: false,
        message: "Database not connected",
        error: "MongoDB connection is not established"
      });
    }
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const usersCount = collections.some(c => c.name === 'users') 
      ? await db.collection('users').countDocuments() 
      : 0;
    
    res.json({
      success: true,
      message: "Database connection test successful! ✅",
      database: {
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        collections: collections.map(c => c.name),
        totalUsers: usersCount,
        readyState: mongoose.connection.readyState
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection test failed",
      error: error.message
    });
  }
});

// Legacy health endpoint for compatibility
app.get("/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  let userCount = 0;
  
  try {
    if (dbStatus === "Connected") {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      if (collections.some(c => c.name === 'users')) {
        userCount = await db.collection('users').countDocuments();
      }
    }
  } catch (error) {
    console.error("Error counting users:", error);
  }
  
  res.json({ 
    status: "OK", 
    database: dbStatus,
    databaseName: mongoose.connection.name || "Not connected",
    totalUsers: userCount,
    timestamp: new Date().toISOString(),
    message: "Backend server is running with MongoDB Atlas! 🎉"
  });
});

// Basic hello endpoint
app.get("/api/hello", (req, res) => { 
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({ 
    msg: "Backend API is running perfectly with MongoDB! 🚀",
    database: dbStatus,
    databaseName: mongoose.connection.name || "Not connected",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Aditya Auchar Portfolio Backend API",
    status: "Running",
    version: "2.0.0",
    database: mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "GET /api/health",
      contact: "POST /api/contact",
      users: "GET /users",
      test: "GET /api/test",
      documentation: "Check /api/health for all endpoints"
    },
    instructions: {
      frontend: `Set VITE_API_URL to http://localhost:${process.env.SERVER_PORT || DEFAULT_PORT}`,
      test: "Run node test-db.js to test database connection"
    }
  });
});

// Enhanced 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      health: "GET /api/health",
      contact: "POST /api/contact",
      users: "GET /users",
      test: "GET /api/test",
      dbTest: "GET /api/db-test",
      root: "GET /"
    },
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error("🚨 Server Error:", error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong. Please try again later.',
    timestamp: new Date().toISOString(),
    requestId: req.id || Date.now()
  });
});

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🏠 Host: ${mongoose.connection.host}`);
  console.log(`🔗 Connection State: ${mongoose.connection.readyState}`);
  console.log('🎯 Database is ready to accept connections!');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err.message);
  console.log('💡 Troubleshooting tips:');
  console.log('   - Check MongoDB Atlas connection string in .env');
  console.log('   - Verify network connectivity');
  console.log('   - Check IP whitelist in MongoDB Atlas');
  console.log('   - Run node test-db.js to test connection');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Start server with auto port detection
const startServer = async () => {
  try {
    const availablePort = await findAvailablePort(DEFAULT_PORT);
    
    // Store the actual port being used
    process.env.SERVER_PORT = availablePort.toString();
    
    app.listen(availablePort, () => {
      console.log(`\n🎉 SUCCESS: Server started successfully!`);
      console.log(`🚀 Server running on port ${availablePort}`);
      console.log(`📍 Health check: http://localhost:${availablePort}/api/health`);
      console.log(`👥 Users API: http://localhost:${availablePort}/users`);
      console.log(`📧 Contact form: http://localhost:${availablePort}/api/contact`);
      console.log(`🧪 Test endpoint: http://localhost:${availablePort}/api/test`);
      console.log(`🌐 Frontend should connect to: http://localhost:${availablePort}`);
      console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
      console.log(`⏰ Server started at: ${new Date().toISOString()}`);
      
      if (availablePort !== parseInt(DEFAULT_PORT)) {
        console.log(`\n💡 IMPORTANT: Port ${DEFAULT_PORT} was busy, using port ${availablePort} instead`);
        console.log(`   Update your frontend .env file:`);
        console.log(`   VITE_API_URL=http://localhost:${availablePort}`);
      }
      
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n💡 Please try one of these solutions:');
    console.log('   1. Kill processes using ports 4000-4010:');
    console.log('      netstat -ano | findstr :4000');
    console.log('      taskkill /PID <PID> /F');
    console.log('   2. Change PORT in .env file to 5001');
    console.log('   3. Wait a few minutes and try again');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  process.exit(0);
});

// Start the server
startServer();

export default app;