import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config'

export const CheckJWT = async (req:Request, res:Response, next:NextFunction)=>{
    //Get the jwt token from the head
    let token = <string>req.get('authorization');
    let jwtPayload;
    
    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401);
        res.json({ message: 'No credentials provided.'});
        // console.log(error);
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    // const { userId, useremail } = jwtPayload;
    // const newToken = jwt.sign(
    //     { userId, useremail }, 
    //     config.jwtSecret, {
    //     expiresIn: "1h"
    // });
    // res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
}