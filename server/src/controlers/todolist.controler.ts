import {Request, Response} from 'express';
import Bluebird from 'bluebird';
import User from '../models/user.model';
import todolist from '../models/todolist.model'
 
export class ToDoListControler {
    static allToDoLists = async (req:Request, res:Response) => {
        const _userId = res.locals.jwtPayload.userId;
        const todolists = await todolist.findAll({where: {userId: _userId}});
        if(todolists === null){
            res.status(200);
            res.json({message: 'No todo list created yet.'});
        }

        res.status(200);
        res.json(todolists);
    }

    static singleToDoList = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        var todolistId = req.params.id;
        const todolist_single = await todolist.findOne({where: {userId: _userId, id: todolistId}});
        if(todolist_single === null){
            res.status(200);
            res.json({message: 'No todo list created yet.'});
        }

        res.status(200);
        res.json(todolist_single);
    }

    static createToDoList = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        let _title  = req.body.title;
        if(!_title){
            res.status(400);
            res.json({message: 'Fields are not provided'});
            return;
        }
        let todolist_instance;

        try {
            todolist_instance = await todolist.create({
                title: _title,
                userId: _userId
            })
        }
        catch(err){
            console.error(err);
            res.status(500);
            res.json({message: 'Internal Server error.'});
            return;
        }

        res.status(201);
        res.json({
            title: todolist_instance?.title,
        });
    }

    static deleteToDoList = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        var todolistId = req.params.id;
        const todolist_single = await todolist.findOne({where: {userId: _userId, id: todolistId}});
        if (todolist_single === null){
            res.status(400);
            res.json({message: 'todo list does not exist.'});
        }
        await todolist.destroy({where: {userId: _userId, id: todolistId}});
        res.status(200).send();
    }

    static updateToDoList = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        let title = req.body.title;
        if(!title){
            res.status(400);
            res.json({message: 'Fields are not provided'});
            return;
        }
        var todolistId = req.params.id;
        
        const todolist_single = await todolist.findOne({where: {userId: _userId, id: todolistId}});
        if(todolist_single === null){
            res.status(400);
            res.json({message: 'todo list does not exist.'});
        }
        todolist_single!.title = title;
        try {
            await todolist_single!.save();
        } catch (err) {
            console.error(err);
            res.status(500);
            res.json({message: 'Internal Server error.'});
            return;
        }

        res.status(200);
        res.json(todolist_single);
    }
}