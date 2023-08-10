import express from 'express';
import { Order } from "../models/order";
import { OrderItem } from '../models/order-item';
const ordersRouter = express.Router();

ordersRouter.get(`/`, async (req, res) =>{
    const orderList = await Order.find();

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

ordersRouter.post(`/`,async (req, res) => {
    const orderItemsIds = await Promise.all(
        req.body.orderItems.map(async(orderItem: any) => {
            const newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });
        
        const addOrderItem = await newOrderItem.save();

        return addOrderItem._id;
    }))
    
    const order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user
    })

    await order.save();
    if(!order)
        return res.status(500).send('The order cannot be created');
    res.status(201).json(order);
})

export default ordersRouter;