import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
});

export const Product = mongoose.model('Product', productSchema);