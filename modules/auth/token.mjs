import { unauthorized } from "../response.mjs";
import jwt from 'jsonwebtoken';
import { secret_key } from "../constant/constant.mjs";

export function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, secret_key, (err, authData) => {
            if (err) {
                console.log(err.toString())
                unauthorized(req, res);
            } else {
                if(typeof authData === "undefined" || authData == null) {
                    unauthorized(req,res);
                } else {
                    req.user = authData;
                    next();
                }
            }
        })
    } else {
        console.log("err")
        unauthorized(req, res);
    }
}

export function verifyUserToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, secret_key, (err, authData) => {
            if (err) {
                unauthorized(req, res);
            } else {
                req.user = authData;
                next();
            }
        })
    } else {
        unauthorized(req, res);
    }
}


export function verifyTokenWithNext(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, secret_key, (err, authData) => {
            if (err) {
                next();
            } else {
                req.user = authData;
                next();
            }
        })
    } else {
        next();
    }
}



export const signIn = (token) => {
    jwt.verify(token, secret_key, (err, authData) => {
        if (err) {
            return err;
        } else {
            return authData;
        }
    })
}