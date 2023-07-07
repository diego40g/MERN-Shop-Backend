import express from 'express';
import { Order } from "../models/order";
const ordersRouter = express.Router();

ordersRouter.get(`/`, async (req, res) =>{
    const orderList = await Order.find();

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

export default ordersRouter;