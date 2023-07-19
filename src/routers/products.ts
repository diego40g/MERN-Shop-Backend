import express from 'express'
import { Product } from '../models/product';
import { Category } from '../models/category';

const productsRouter = express.Router();

productsRouter.get(`/`, async(req, res) => {
    const productList = await Product.find().populate('category');

    if(!productList) {
        res.status(500).json({
            success: false
        })
    }

    res.status(200).send(productList);
});
productsRouter.get(`/all`, async(req, res) => {
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({
            success: false
        })
    }

    res.status(200).send(productList);
});
productsRouter.get(`/name`, async(req, res) => {
    const productList = await Product.find().select('name');

    if(!productList) {
        res.status(500).json({
            success: false
        })
    }

    res.status(200).send(productList);
});
productsRouter.get(`/image`, async(req, res) => {
    const productList = await Product.find().select('name image -_id');

    if(!productList) {
        res.status(500).json({
            success: false
        })
    }

    res.status(200).send(productList);
});
productsRouter.get('/:id', async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        res.status(500).json({
            success: false
        })
    }

    res.status(200).send(product);
})
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