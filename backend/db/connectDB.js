import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        // Log the MongoDB URI (ensure it’s not exposed in production)
        console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);

        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected:', conn.connection.host);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
