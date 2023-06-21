import mongoose from 'mongoose';
const { Schema } = mongoose;

const followSchema = new Schema({
    icon_name: String, // String is shorthand for {type: String}
    social_link: String,
    sequence: Number,
    active: Boolean,
    inserted_date: { type: Date, default: Date.now }
});

const Follow = mongoose.model('Follow', followSchema);
export default Follow