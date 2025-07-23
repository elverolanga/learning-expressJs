import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth.js';

import User from '../models/User.js';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
    {
        return res.status(401).json({error: "Token is not provided!"});
    }
    const [, token] = authHeader.split(" ");

    try
    {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;
        

        return next();
    }
    catch(error)
    {
        return res.status(401).json(error, {error: "Token is invalid"});

    }
}

/**
 * const authHeader = req.headers.authorization;

    if(authHeader && authHeader === "secret")
    {
        return next();
    }

    return res
    .status(401)
    .json({error: "User not allowed to access this API."})
 */
