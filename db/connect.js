const mongoose = require("mongoose");
const { mongoUri } = require("../config/config");

const connectDB = async () => {
  if (!mongoUri) throw new Error("MONGO_URI is not defined in .env");
  const conn = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;