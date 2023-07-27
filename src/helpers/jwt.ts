import { expressjwt } from "express-jwt";
import * as dotenv from 'dotenv';

dotenv.config({path:'./.env'});

const secretKey = process.env.JWT_SECRET;
const authJwt = expressjwt({ 
    secret: secretKey!, 
    algorithms: ['HS256'], 
}).unless({
    path: [
        '/api/v1/users/login',
        '/api/v1/users/register'
    ]
})

export default authJwt;