import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TodolistService } from './todolist.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable, throwError, combineLatest, BehaviorSubject, of } from 'rxjs';
import { catchError, retry, tap, shareReplay, map, filter } from 'rxjs/operators';
import { ToDoList } from '../models/todolist.model';
import { Task } from '../models/task.model';


@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  errorMessage: string;
  selectedToDoListNumber: number;
  selectedToDoListBtn: boolean;
  todolistsArray = []
  tasksArray = []

  selectedToDoList$ = this.todolistService.selectedToDoList$;
  
  // vm$ = combineLatest(
  //   [this.todolists$,
  //   this.selectedToDoList$,
  //   this.selectedToDoListTasks$])
  //   .pipe(
  //     map( ([todolists, _todolist, tasks]: [ToDoList[], ToDoList, Task[]]) =>
  //     ({ todolists, _todolist, tasks}) )
  //   );


  addNewToDoListForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(40)])
  });

  addnewTaskForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
    description: new FormControl('')
  })

  constructor(
    private todolistService: TodolistService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.todolistService.newToDoListCreated.subscribe(()=>{
      this.getallToDoLists();
    })
    this.todolistService.newTaskCreated.subscribe(()=>{
      console.log('HOgaya');
      this.getallTasks();
    })

    this.getallToDoLists();
  }

  ngOnDestroy(): void {
  }

  getallToDoLists(){
    this.todolistService.todolists$.subscribe((data)=>{
      this.todolistsArray = data;
    })
  }

  getallTasks(){
    this.todolistService.getTasks(this.selectedToDoListNumber).subscribe((data)=>{
      this.tasksArray = data;
    })
  }

  // New ToDo List 
  get title(){
    return this.addNewToDoListForm.get('title');
  }

  settitle(data:string){
    this.addNewToDoListForm.get('title').setValue(data);
  }

  AddNewToDoListModal(content) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      if(result === 'Addnewtodolist'){
        this.AddNewToDoList();
      }
    });
  }

  AddNewToDoList(){
    this.todolistService.postToDoList(this.getTitle()).subscribe((data: ToDoList)=>{
      this.settitle('');
    })
  }

  getTitle(){
    return this.addNewToDoListForm.get('title').value;
  }

  // Select ToDo List from UI
  selectToDoList(id:number){
    this.selectedToDoListNumber = id;
    this.selectedToDoListBtn = true;
    this.todolistService.changeSelectedtodolist(id);
    this.getallTasks();
  }

  //Add new Task in selected ToDo List
  getName (){
    return this.addnewTaskForm.get('name').value;
  }

  getDescription (){
    return this.addnewTaskForm.get('description').value;
  }

  setName (name: string){
    this.addnewTaskForm.get('name').setValue(name);
  }
  
  setDescription (description:string){
    this.addnewTaskForm.get('description').setValue(description);
  }

  AddNewTaskModal(content) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      if(result === 'AddnewTask'){
        this.AddNewTask();
      }
    });
  }

  AddNewTask(){
    this.todolistService.postTask(this.selectedToDoListNumber, this.getName(), this.getDescription())
    .subscribe(()=>{
      this.setName('');
      this.settitle('');
    })
  }

}
