import {Request, Response} from 'express';
import User from '../models/user.model';
 
export class UserControler {

    static register = async (req: Request, res: Response) => {
        
        let {fullname, email, password} = req.body

        if(!(fullname && email && password)){
            res.status(400)
            res.json({'message': 'Provide all the fields'})
        }

        let user: User | null;
        user = await User.findOne({ where: {email: email}});
        if(user !== null){
            res.status(400);
            res.json({'message': 'This user already exist.'});
            return;
        }
        let new_user;
        try{
            new_user = await User.create({
                full_name: fullname,
                email: email,
                password: password
            })
        }
        catch(err) {
            console.error(err);
            res.status(400);
            res.json({message: 'Internal Server error.'});
        }

        new_user?.hashpassword();
        new_user?.save();

        res.status(201);
        res.json({'message': 'User Created.'});
    }

    static checkEmail = async (req: Request, res: Response) => {
        let _email = req.body.email
        if(!_email){
            res.status(400);
            res.json({'message': 'Provide email field.'});
            return;
        }

        let user: User | null;
        user = await User.findOne({ where: {email: _email}});
        if(user !== null){
            res.status(400);
            res.json({'message': 'This email already exist.'});
            return;
        }

        res.status(200);
        res.json({'message': ''})
    }
}