import express from 'express';
import { Order } from "../models/order";
import { OrderItem } from '../models/order-item';
const ordersRouter = express.Router();

ordersRouter.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered':-1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})
ordersRouter.get(`/all`, async (req, res) =>{
    const orderList = await Order.find();

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})
ordersRouter.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
        .populate('user','name')
        //.populate({path:'orderItems', populate: 'product'});
        .populate({
            path:'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
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

ordersRouter.put('/:id',async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {new: true}
    )
    if(!order)
        return res.status(400).send('The order cannot be created');
    res.status(201).send(order);
})

ordersRouter.delete('/:id', async(req,res) => {
    Order.findByIdAndRemove(req.params.id).then(async (order:any) => {
        if(order) {
            await Promise.all(order.orderItems.map(async(orderItem:any) => {
                await OrderItem.findByIdAndRemove(orderItem);
            }))
            return res.status(200).json({
                success: true,
                message: 'The order is deleted!!!'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'Order not found!!!'
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        })
    })
})

export default ordersRouter;