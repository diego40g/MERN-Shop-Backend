/*import { expressjwt } from "express-jwt";
import * as dotenv from 'dotenv';
import { JwtPayload } from "jsonwebtoken";
import { Request } from 'express';

dotenv.config({path:'./.env'});

const secretKey = process.env.JWT_SECRET;
const api = process.env.API_URL;
const tokenBlacklist: Set<string> = new Set();
type IsRevokedFunction = (req: Request, payload: JwtPayload, done: (err: Error | null, revoked: boolean, reason?: any) => void) => void;
const customIsRevoked: IsRevokedFunction = (req, payload, done) => {
    const token = req.headers.authorization?.split(' ')[1];
    const isRevoked = token ? tokenBlacklist.has(token) : false;
  
    done(null, isRevoked);
};
/*if(!payload.isAdmin){
            done(null, true);
        }
        done();/

const authJwt = expressjwt({ 
    secret: secretKey!, 
    algorithms: ['HS256'], 
    isRevoked: customIsRevoked,
}).unless({
    path: [
        {url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS']},
        {url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS']},
        `${api}/user/login`,
        `${api}/user/register`
    ]
})



export default authJwt;*/
import expressJwt, { Request } from 'express-jwt';
import { JwtPayload } from 'jsonwebtoken';

const api = process.env.API_URL;

// Tipo para la función isRevoked
type IsRevokedFunction = (req: Request, payload: JwtPayload, done: (error: Error | null, revoked?: boolean) => void) => void;

// Función isRevoked
const isRevoked: IsRevokedFunction = (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  } else {
    done(null, false);
  }
};

function authJwt() {
  const secret = process.env.secret;
  
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ]
  });
}

export default authJwt;