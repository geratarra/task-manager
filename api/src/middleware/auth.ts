import { Request, Response, NextFunction } from 'express';
import { JWT_KEY } from '../utils/constants';

const jwt = require('jsonwebtoken');

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split('Bearer ')[1]; // Get token from Bearer header

        jwt.verify(token, JWT_KEY, (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};