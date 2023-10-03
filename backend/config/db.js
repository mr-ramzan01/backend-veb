const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");


let dbInstance = undefined;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB
    );
    dbInstance = connectionInstance;
    console.log(
      `MongoDB Connected! Db host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

module.exports =  {connectDB,dbInstance};
