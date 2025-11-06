const mongoose = require("mongoose");
require("dotenv").config();

// mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`connection to MongoDB`))
  .catch((err) => console.log(err));
