import mongoose from 'mongoose';
const { Schema } = mongoose;

const pageCategorySchema = new Schema({
    name: String, // String is shorthand for {type: String}
    active: Boolean,
    inserted_date: { type: Date, default: Date.now }
});

const Page_Categorie = mongoose.model('Page_Categorie', pageCategorySchema);
export default Page_Categorie