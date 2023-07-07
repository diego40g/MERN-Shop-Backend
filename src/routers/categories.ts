import express from "express";
import { Category } from "../models/category";

const categoriesRoute = express.Router()

categoriesRoute.get('/',async(req,res)=>{
    const categoriesList = await Category.find();
    
    if (!categoriesList){
        res.status(500).json({success: false})
    }
    res.send(categoriesList)
})

export default categoriesRoute;