import expressJwt from 'express-jwt';

function authJwt() {
    const secrect = process.env.secret;
    return expressJwt({
        secrect: secrect,
        algorithms: ['HS256']
    })
}

export default authJwt;