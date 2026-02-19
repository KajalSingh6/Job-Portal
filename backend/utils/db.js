import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { dbName: "JOB_PORTAL" });
        console.log("Database connected successfully!");

    } catch (error) {
        console.log("Database Disconnected!", error);
    }
}

export default connectDB;