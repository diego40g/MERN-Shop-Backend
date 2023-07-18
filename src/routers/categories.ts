import express from "express";
import { Category } from "../models/category";

const categoriesRoute = express.Router()

categoriesRoute.get('/',async(req,res)=>{
    const categoriesList = await Category.find();
    
    if (!categoriesList){
        res.status(500).json({success: false})
    }
    res.status(200).send(categoriesList)
})

categoriesRoute.get('/:id', async(req,res) => {
    const category = await Category.findById(req.params.id);

    if(!category){
        res.status(500).json({message: 'The category with the id was not found.'})
    }

    res.status(200).send(category)
})

categoriesRoute.post('/', async(req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        image: req.body.image
    })
    category=await category.save();
    if(!category)
        return res.status(404).send('The category cannot be created!!!')
    
    res.send(category);
})

categoriesRoute.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        { new: true }
    )

    if(!category)
        return res.status(400).send('The category cannot be created!');
    res.status(200).send(category);
})

categoriesRoute.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(category) {
            return res.status(200).json({
                success: true,
                message: 'The category is deleted!!!'
            })
        }else{
            return res.status(404).json({
                success: false,
                message: 'Category not found!!!'
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

export default categoriesRoute;