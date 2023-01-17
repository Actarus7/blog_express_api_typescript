import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
const accessTokenSecret = process.env.TOKEN_SECRET as string;

declare global {
    namespace Express {
        interface Request {
            userId?: JwtPayload // permet d'inserer un user a req pour l'id
        }
    }
};
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, token) => {
            if (err) {return res.sendStatus(403)}
            req.userId = (token as jwt.JwtPayload).userId
            next();
        });
    } else {
        res.sendStatus(401);
    }
};