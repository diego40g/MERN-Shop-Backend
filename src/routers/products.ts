import express from 'express'
import { Product } from '../models/product';
import { Category } from '../models/category';
import mongoose from 'mongoose';

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
productsRouter.get(`/byCategory`, async(req, res) => {
    //localhost:3000/api/v1/products/byCategory?categories=id1,id2
    const categories: String | undefined = req.query.categories[0];
    if(req.query.categories){
        const filter = {category: req.query.categories.split(',')};
    }

    const productList = await Product.find({category: []}).populate('category');

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
        return res.status(500).json({
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
productsRouter.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    
    if(!category) 
        return res.status(400).send('Invalid Category')
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        { new: true }
    )

    if(!product)
        return res.status(400).send('The product cannot be created!');
    res.status(200).send(product);
});
productsRouter.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product) {
            return res.status(200).json({
                success: true,
                message: 'The product is deleted!!!'
            })
        }else{
            return res.status(404).json({
                success: false,
                message: 'Product not found!!!'
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        })
    })
})
productsRouter.get('/get/count',async (req,res) => {
    const productCount = await Product.countDocuments()
                                .then((count: any) => count)
                                .catch((error)=>error);

    if(!productCount){
        return res.status(500).json({success: false})
    }
    res.send({
        productCount: productCount
    });
})
productsRouter.get(`/get/featured/:count`, async (req,res) => {
    const count = req.params.count ? req.params.count: 0;
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products) {
        res.status(500).json({success: false})
    }
    res.send(products);
})

export default productsRouter;