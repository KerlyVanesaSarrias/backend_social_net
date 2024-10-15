import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

const connection = async() => {
    try {
        await connect(process.env.MONGODB_URI);
            console.log("Connected to MongoDB");
            } catch (error) {
                console.log("Error connecting to DB:", error);
                throw new Error("Error connecting to DB")
            }
};

export default connection;