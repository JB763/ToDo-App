import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI as string);
        const url = `${connection.host}:${connection.port}`;
        console.log(`Connected to Database: ${url}`);
    } catch (error) {
        console.log((error as Error).message);
        process.exit(1);
    }
} 