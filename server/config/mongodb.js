import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB...');
        // We specify dbName in options instead of manipulating the URI string
        await mongoose.connect(uri, {
            dbName: 'mern-auth',
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        // Important: Don't exit process on Azure as it might cause boot loops, 
        // but log it clearly.
    }
};

export default connectDB;
