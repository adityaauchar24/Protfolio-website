import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✅ Connection to MongoDB successful`))
  .catch((err) => console.log("❌ MongoDB connection error:", err));