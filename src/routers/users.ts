import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userSchema, { User } from "../models/user";
import * as dotenv from 'dotenv';

dotenv.config({path:'./.env'});
const usersRouter = express.Router();

usersRouter.get(`/`, async (req: Request, res: Response): Promise<void> => {
    const userList = await User.find().select('name phone email');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userList);
});
usersRouter.get(`/allData`, async (req: Request, res: Response): Promise<void> => {
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userList);
});
usersRouter.get('/:id', async(req: Request,res:Response)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})
usersRouter.post(`/`, async (req: Request, res: Response) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        passwordHash: bcrypt.hashSync(req.body.passwordHash,Number.parseInt(process.env.PASSWORD_HASH!)),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    const addUser = await user.save();

    if(!user)
        return res.status(500).send('The user cannot be created!');
    
    res.status(201).json(addUser)
})

export default usersRouter;