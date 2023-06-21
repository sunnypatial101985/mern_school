import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, index: true, unique: true },
    name: String,
    password: String,
    pic: String,
    gender: Number,
    active: Boolean,
    inserted_date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User