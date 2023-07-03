import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

const app = express();
dotenv.config({path:'./.env'});
const api = process.env.API_URL;

app.use(express.json());//app.use(bodyParser.json())
app.use(morgan('tiny'));

app.get(`${api}/product`, (req, res) => {
    const product = {
        id: 1,
        name: 'hair dresser',
        image: 'some_url',
    }
    res.send(product);
});
app.post(`${api}/product`, (req, res) => {
    const newProduct = req.body
    res.send(newProduct);
});

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