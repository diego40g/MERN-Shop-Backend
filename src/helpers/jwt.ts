import { expressjwt } from "express-jwt";
import * as dotenv from 'dotenv';

dotenv.config({path:'./.env'});

const secretKey = process.env.JWT_SECRET;
const api = process.env.API_URL;
const authJwt = expressjwt({ 
    secret: secretKey!, 
    algorithms: ['HS256'], 
}).unless({
    path: [
        {url: `${api}/products`, methods: ['GET', 'OPTIONS']},
        `${api}/users/login`,
        `${api}/users/register`
    ]
})

export default authJwt;