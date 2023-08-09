import mongoose, { Schema, Document, Model } from 'mongoose';

interface IOrderItem extends Document {
    product: Schema.Types.ObjectId;
    quantity: number;
}

const orderItemSchema: Schema<IOrderItem> = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
})

export const OrderItem: Model<IOrderItem> = mongoose.model('OrderItem', orderItemSchema);