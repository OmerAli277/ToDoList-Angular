import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, combineLatest, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, retry, tap, shareReplay, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ToDoList } from '../models/todolist.model';
import{ Task } from '../models/task.model';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {

  private todolistsUrl = '/api/todolists';
  private tasksUrl = '/api/todolists/tasks/';
  private todolistCreateUrl = '/api/todolists/create';
  private taskCreateUrl = '/api/tasks/create/'
  private datafromsub;

  private todolistSelectedAction = new BehaviorSubject<number>(0);
  private _newToDoListCreated = new Subject<void>();
  private _newTaskCreated = new Subject<void>();


  get newToDoListCreated (){
    return this._newToDoListCreated;
  }

  get newTaskCreated (){
    return this._newTaskCreated;
  }

  todolists$ = this.http.get<ToDoList[]>(this.todolistsUrl);

  // Currently selected todo list
  // Used in both List and Detail pages,
  // so use the shareReply to share it with any component that uses it
  // Location of the shareReplay matters ... won't share anything *after* the shareReplay
  selectedToDoList$ = combineLatest(
    [this.todolistSelectedAction,
     this.todolists$]
  ).pipe(
    map( ([selectedToDoListId, toDoListArray]) => toDoListArray.find(toDoList => toDoList.id == selectedToDoListId) )
  );

  todolistTasks$ = combineLatest( this.todolistSelectedAction )
  .pipe(
    map( ([ID]) => { 
      this.http.get<Task[]>(this.tasksUrl + ID).subscribe((data)=> { this.datafromsub = data});
      return this.datafromsub;
    })
  );
  

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Change the selected todolist
  changeSelectedtodolist(selectedToDoListId: number | null) {
    this.todolistSelectedAction.next(selectedToDoListId);

    this.todolistSelectedAction.subscribe((data) => {
      return this.http.get<Task[]>(this.tasksUrl + data)
      .pipe(
        shareReplay(1),
      )
    })
  }

  getTasks(id: number){
    if(id){
      return this.http.get<Task[]>(this.tasksUrl + id)
    }
    return of(null)
  }

  postToDoList(title: string){
    return this.http.post<ToDoList>(this.todolistCreateUrl, {title})
    .pipe(
      tap(()=>{
        this._newToDoListCreated.next();
      })
    )
  }

  postTask(todolistId: number, name: string, description: string, ){
    return this.http.post<ToDoList>(this.taskCreateUrl + todolistId, {name, description})
    .pipe(
      tap(()=>{
        this._newTaskCreated.next();
      })
    )
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
      if(error.status === 401)
      {
        this.router.navigate(['login']);
      }
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
