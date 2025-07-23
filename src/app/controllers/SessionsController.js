import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authConfig from '../../config/auth.js';
class SessionsController
{
    async create(req, res)
    {
        const { email, password }  = req.body;

        const user = await User.findOne({
            where: {email}
        })
        if(!user)
        {
            return res.status(401).json({error: "User not found "});
        }

        if(! (await user.checkPassword(password))){
            return res.status(401).json({error: "Password not match"});
        }

        const { id, name } = user;
        return res.status(200).json({
            user:{
                id, name, email
            },
            token: jwt.sign({id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            } ),
            msh: "Login successfully!"
        });
    }
}

export default new SessionsController();
