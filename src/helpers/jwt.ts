import { expressjwt } from "express-jwt";
import * as dotenv from 'dotenv';
import { Secret, JwtPayload } from "jsonwebtoken";
import { Request } from 'express';

dotenv.config({path:'./.env'});

const api = process.env.API_URL!;
const secretKey: Secret = process.env.JWT_SECRET!;

const isRevoked = (req: Request, token: any) => {
  let tokenPayload: JwtPayload = <JwtPayload>token!['payload']
  console.log(`Admin: ${tokenPayload['isAdmin']}`);
  /*if(!payload.isAdmin){
      done(null, true);
    }
    done();*/
  return !tokenPayload['isAdmin']
}
const authJwt = expressjwt({
    secret: secretKey,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      {url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS']},
      `${api}/user/login`,
      `${api}/user/register`
    ]
});

export default authJwt;