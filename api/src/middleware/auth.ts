import { Request, Response, NextFunction } from 'express';
import { JWT_KEY } from '../utils/constants';

const jwt = require('jsonwebtoken');

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const jwtCookie = req.cookies.jwt;

    const tokenFromCookie = jwtCookie;
    const tokenFromAuthHeader = authHeader ? authHeader.split('Bearer ')[1] : null;
    const token = tokenFromCookie || tokenFromAuthHeader;
    
    if (token) {
        jwt.verify(token, JWT_KEY, (err: any, user: any) => {
            if (err) {
                console.error(err);
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};