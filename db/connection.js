import mongoose from "mongoose";
const connectDb = async(url) => {
    try {
        await mongoose.connect(url);

    } catch (error) {

    }
}

export default connectDb