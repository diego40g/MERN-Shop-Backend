import mongoose, { Schema, Document, Model } from 'mongoose';

export default interface IProduct extends Document {
    name: string;
    description: string;
    richDescription: string;
    image: string;
    images: Array<string>;
    brand: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    countInStock: number;
    rating: number;
    numReviews: number;
    isFeatured: boolean;
    dateCreated: Date;
}

const productSchema: Schema<IProduct> = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
});

productSchema.virtual('id').get(function(this: Document) {
    return this._id.toHexString();
})

productSchema.set('toJSON', {
    virtuals: true,
})

export const Product: Model<IProduct> = mongoose.model('Product', productSchema);
