import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  // Check if already connected
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
