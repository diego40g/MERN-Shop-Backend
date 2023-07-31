import { expressjwt } from "express-jwt";
import * as dotenv from 'dotenv';

dotenv.config({path:'./.env'});

const secretKey = process.env.JWT_SECRET;
const api = process.env.API_URL;
const authJwt = expressjwt({ 
    secret: secretKey!, 
    algorithms: ['HS256'], 
    isRevoked: revoked!,
}).unless({
    path: [
        {url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS']},
        {url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS']},
        `${api}/user/login`,
        `${api}/user/register`
    ]
})

const revoked = async(req: Request, payload: any, done: any) => {
    if(!payload.isAdmin){
        done(null, true);
    }

    done();
}

export default authJwt;