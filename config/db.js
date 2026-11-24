
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully!");
        console.log("Database Name:", conn.connection.name);
        console.log("Host:", conn.connection.host);

    } catch (error) {
        console.log("MongoDB Error:", error.message);
        throw error;
    }
};

export default connectDB;
