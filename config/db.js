import mongoose from "mongoose";

// Database connection

const DatabaseConnections = async () => {
  try {
    const result = await mongoose.connect(
      `mongodb+srv://nazmulislamador:${process.env.DATABASE_PASSWORD}@cluster0.mviiux1.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
    );
    console.log(`Database connected`);
  } catch (err) {
    console.log("Error connecting to database: ", err);
  }
};

export default DatabaseConnections;
