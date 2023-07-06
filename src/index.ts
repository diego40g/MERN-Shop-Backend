import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import productsRouter from './routers/products'

const app = express();
dotenv.config({path:'./.env'});
const api = process.env.API_URL;

//middelware
app.use(express.json());//app.use(bodyParser.json())
app.use(morgan('tiny'));

//routes
app.use(`${api}/product`, productsRouter)

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

app.listen(process.env.PORT, () => {
    console.log(`The server was running in port ${process.env.PORT}`);
})