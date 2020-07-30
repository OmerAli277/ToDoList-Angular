import {Request, Response} from 'express';
import Bluebird from 'bluebird';
import User from '../models/user.model';
import task from '../models/task.model'
 
export class TaskControler {
    static alltasks = async (req:Request, res:Response) => {
        const _userId = res.locals.jwtPayload.userId;
        var todolist_Id = req.params.todolist_id;
        const tasks = await task.findAll({where: {todolistId: todolist_Id}});
        if(tasks === null){
            res.status(200);
            res.json({message: 'No task created yet.'});
        }

        res.status(200);
        res.json(tasks);
    }

    static singletask = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        var taskId = req.params.id;
        const task_single = await task.findOne({where: {id: taskId}});
        if(task_single === null){
            res.status(200);
            res.json({message: 'No task created yet.'});
        }

        res.status(200);
        res.json(task_single);
    }

    static createtask = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        let {name, description}  = req.body;
        var todolist_Id = req.params.todolist_id;
        if(!name){
            res.status(400);
            res.json({message: 'Fields are not provided'});
            return;
        }
        let task_instance;
        try {
            task_instance = await task.create({
                name: name,
                description: description,
                todolistId : todolist_Id
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
            name: task_instance?.name,
            description: task_instance?.description,
            todolistId: todolist_Id
        });
    }

    static deletetask = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        var taskId = req.params.id;
        const task_single = await task.findOne({where: {id: taskId}});
        if (task_single === null){
            res.status(400);
            res.json({message: 'task does not exist.'});
        }
        await task.destroy({where: {id: taskId}});
        res.status(200).send();
    }

    static updatetask = async (req:Request, res:Response) => {
        let _userId = res.locals.jwtPayload.userId;
        var taskId = req.params.id;
        let {name, description}  = req.body;
        try {
            await task.update({
                name: name,
                description: description
            }, { where: {
                id: taskId
            }})

        } catch (err) {
            console.error(err);
            res.status(500);
            res.json({message: 'Internal Server error.'});
            return;
        }
        const task_single = await task.findOne({where: {id: taskId}});
        res.status(200);
        res.json(task_single);
    }
}