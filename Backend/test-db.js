import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("🧪 Testing MongoDB Atlas connection...");
    console.log("📁 Database:", process.env.DB_NAME || 'aditya-protfolio');
    
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in .env file");
      console.log("💡 Please check your .env file in the Backend folder");
      return;
    }

    // Mask the password in the connection string for security
    const maskedURI = process.env.MONGO_URI.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log("🔗 Connection String:", maskedURI);
    
    console.log("🔄 Attempting to connect to MongoDB Atlas...");
    
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    console.log("✅ Connected to MongoDB Atlas successfully!");
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📈 Ready State: ${mongoose.connection.readyState}`);
    
    // Test if we can access the database
    const db = mongoose.connection.db;
    console.log("🔍 Checking database collections...");
    
    const collections = await db.listCollections().toArray();
    console.log("📁 Available collections:", collections.map(c => c.name));
    
    // Test if users collection exists and count documents
    if (collections.some(c => c.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`👥 Total users in database: ${usersCount}`);
      
      // Show sample data if any exists
      if (usersCount > 0) {
        const sampleUsers = await db.collection('users').find().sort({ createdAt: -1 }).limit(3).toArray();
        console.log("📋 Recent user submissions:");
        sampleUsers.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.fullname} (${user.email})`);
          console.log(`      Message: ${user.message.substring(0, 50)}${user.message.length > 50 ? '...' : ''}`);
          console.log(`      Submitted: ${new Date(user.createdAt).toLocaleString()}`);
          console.log(`      ID: ${user._id}`);
        });
      } else {
        console.log("📭 No user submissions found in the database yet.");
        console.log("💡 The contact form will create the first document automatically.");
      }
    } else {
      console.log("⚠️ 'users' collection does not exist yet.");
      console.log("💡 It will be created automatically when the first form is submitted.");
    }
    
    // Test database operations
    console.log("🔧 Testing database operations...");
    
    // Test creating a sample document
    const testUser = {
      fullname: "Test User - Connection Test",
      email: "test@example.com",
      address: "Test Address for Database Connection",
      message: "This is a test message from database connection test. This should be automatically deleted.",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Try to insert a test document (we'll delete it immediately)
    const result = await db.collection('testconnection').insertOne(testUser);
    console.log("✅ Database write operation: SUCCESS");
    
    // Test read operation
    const foundDoc = await db.collection('testconnection').findOne({ _id: result.insertedId });
    console.log("✅ Database read operation: SUCCESS");
    
    // Test delete operation
    await db.collection('testconnection').deleteOne({ _id: result.insertedId });
    console.log("✅ Database delete operation: SUCCESS");
    
    // Check database stats
    const stats = await db.stats();
    console.log("📊 Database Statistics:");
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Documents: ${stats.objects}`);
    console.log(`   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
    await mongoose.connection.close();
    console.log("🔌 Connection closed.");
    console.log("🎉 All database tests passed successfully!");
    console.log("🚀 Your MongoDB Atlas connection is working perfectly!");
    
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    console.log("💡 Troubleshooting tips:");
    console.log("   1. Check your MONGO_URI in .env file");
    console.log("   2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)");
    console.log("   3. Check internet connection");
    console.log("   4. Verify database user permissions in MongoDB Atlas");
    console.log("   5. Ensure the database user has read/write permissions");
    console.log("   6. Check if MongoDB Atlas cluster is running");
    console.log("   7. Verify the database name in connection string");
    
    if (error.name === 'MongoServerSelectionError') {
      console.log("🔧 Specific issue: Cannot reach MongoDB server");
    } else if (error.name === 'MongoNetworkError') {
      console.log("🔧 Specific issue: Network connectivity problem");
    } else if (error.name === 'MongoAuthenticationError') {
      console.log("🔧 Specific issue: Authentication failed - check username/password");
    }
    
    process.exit(1);
  }
};

// Run the test
testConnection();