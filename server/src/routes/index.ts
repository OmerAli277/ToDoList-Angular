import { Router} from "express";
import { ToDoListControler } from '../controlers/todolist.controler';
import { UserControler } from '../controlers/user.controler';
import { AuthControler } from '../controlers/auth.controler';
import { TaskControler } from '../controlers/task.controler';
import { CheckJWT } from '../middlewares/checkjwt.middleware';

const router = Router();

router.post('/auth/token/obtain', AuthControler.login);

router.post('/user/register', UserControler.register);
router.post('/user/checkemail', UserControler.checkEmail);

router.get('/todolists', CheckJWT, ToDoListControler.allToDoLists);
router.get('/todolists/:id([0-9]+)', CheckJWT, ToDoListControler.singleToDoList);
router.post('/todolists/create', CheckJWT, ToDoListControler.createToDoList);
router.put('/todolists/:id([0-9]+)', CheckJWT, ToDoListControler.updateToDoList);
router.delete('/todolists/:id([0-9]+)', CheckJWT, ToDoListControler.deleteToDoList);

router.get('/todolists/tasks/:todolist_id([0-9]+)', CheckJWT, TaskControler.alltasks);
router.get('/tasks/:id([0-9]+)', CheckJWT, TaskControler.singletask);
router.post('/tasks/create/:todolist_id([0-9]+)', CheckJWT, TaskControler.createtask);
router.put('/tasks/:id([0-9]+)', CheckJWT, TaskControler.updatetask);
router.delete('/tasks/:id([0-9]+)', CheckJWT, TaskControler.deletetask);

export default router;