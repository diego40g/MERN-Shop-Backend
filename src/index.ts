import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authJwt from './helpers/jwt';
import { errorHandle } from './helpers/error_handle';
import cors from 'cors';

import categoriesRoute from './routers/categories';
import productsRouter from './routers/products';
import usersRouter from './routers/users';
import ordersRouter from './routers/orders';

const app = express();
dotenv.config({path:'./.env'});
const api = process.env.API_URL;

//Cors active
app.use(cors());
app.options('*',cors());

//middelware
app.use(express.json());//app.use(bodyParser.json())
app.use(morgan('tiny'));

app.use(authJwt);

app.use(errorHandle);

//routes
app.use(`${api}/category`, categoriesRoute)
app.use(`${api}/product`, productsRouter)
app.use(`${api}/user`, usersRouter)
app.use(`${api}/order`, ordersRouter)

//database
mongoose.connect(process.env.MONGO_CONNECT!, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
})
.then(()=>{
    console.log("Database connection is ready...")
})
.catch((err)=>{
    console.log(err)
})

//server
app.listen(process.env.PORT, () => {
    console.log(`The server was running in port ${process.env.PORT}`);
})