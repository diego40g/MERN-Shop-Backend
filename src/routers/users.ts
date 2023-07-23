import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userSchema, { User } from "../models/user";

const usersRouter = express.Router();

usersRouter.get(`/`, async (req: Request, res: Response): Promise<void> => {
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userList);
});
usersRouter.post(`/`, async (req: Request, res: Response) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, process.env.PASSWORD_HASH),
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