import express from 'express';
import { Order } from "../models/order";
import IOrderItem, { OrderItem } from '../models/order-item';
import IProduct from '../models/product';
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


    const totalPrices: number[] = await Promise.all(orderItemsIds.map(async (orderItemId: string) => {
        const orderItem: IOrderItem | null = await OrderItem.findById(orderItemId).populate('product');
    
        if (!orderItem) {
            res.status(400).send(`The order was not found for the ID: ${orderItemId}`); 
            return 0;
        }
    
        if (!orderItem.product) {
            res.status(400).send(`The product was not find for an order item ID: ${orderItemId}`);
            return 0;
        }
    
        const product: IProduct = orderItem.product as unknown as IProduct;
        
        const totalPrice: number = product.price * orderItem.quantity;
        return totalPrice;
    }));
    
    const totalPrice: number = totalPrices.reduce((a: number, b: number) => a + b, 0);  
    
    const order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
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

ordersRouter.get('/get/totalsales', async (req,res)=>{
    const totalSales = await Order.aggregate([
        { $group: {_id:null, totalsales: {$sum: '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})

ordersRouter.get(`/get/count`,async (req,res) => {
    const orderCount = await Order.countDocuments();

    if(!orderCount) {
        res.status(500).json({success: false})
    }
    res.send({
        orderCount: orderCount
    })
})

ordersRouter.get(`/get/userorders/:userid`,async (req ,res) => {
    const userOrderList = await Order.find({user: req.params.userid}).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({'dateOrdered':-1});

    if(!userOrderList){
        res.status(500).json({success: false})
    }
    res.status(201).send(userOrderList)
})

export default ordersRouter;