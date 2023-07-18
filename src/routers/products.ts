import express from 'express'
import { Product } from '../models/product';
import { Category } from '../models/category';

const productsRouter = express.Router();

productsRouter.get(`/`, async(req, res) => {
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({
            success: false
        })
    }

    res.send(productList);
});
productsRouter.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) 
        return res.status(400).send('Invalid Category')

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    const addProduct = await product.save();
    if(!product)
        return res.status(500).send('The product cannot be created')
    res.status(201).json(addProduct);
});

export default productsRouter;