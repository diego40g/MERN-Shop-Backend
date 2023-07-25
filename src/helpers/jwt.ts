import { expressjwt } from "express-jwt";
import * as dotenv from 'dotenv';

dotenv.config({path:'./.env'});

const secretKey = process.env.JWT_SECRET;
const authJwt = expressjwt({ 
    secret: secretKey!, 
    algorithms: ['HS256'], 
})

export default authJwt;