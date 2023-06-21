import mongoose from 'mongoose';
const { Schema } = mongoose;

const contentSchema = new Schema({
    title: String, // String is shorthand for {type: String}
    description: String,
    pic: String,
    page_cat_id: { type: 'ObjectId', ref: 'Page_Categorie' },
    sequence: Number,
    active: Boolean,
    inserted_date: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);
export default Content