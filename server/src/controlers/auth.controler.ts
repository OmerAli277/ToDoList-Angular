import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import config from '../config/config'

export class AuthControler {
    static login = async (req:Request, res:Response) => {
        let {email, password} = req.body
        if(!(email && password)){
            res.status(400)
            res.json({'message': 'provide both email and password'});
            return;
        }

        let user: User | null;
        user = await User.findOne({ where : {email : email} });
        if(user === null){
            res.status(401)
            res.json({'message': 'user is not authenticated'});
            return;
        }

        if(! user!.checkpasswordhash(password))
        {
            res.status(401)
            res.json({'message': 'user is not authenticated'});
            return;
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user!.id, useremail: user!.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );
    
        //Send the jwt in the response
        res.status(200);
        res.json({
            'authorization' : token,
            'expiresIn': '1h'
        });
    }
}