import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodolistsRoutingModule } from './todolists-routing.module';
import { TodolistsComponent } from './todolists.component';
import { ViewTodolistsComponent } from './view-todolists/view-todolists.component';
import { CreateTodolistComponent } from './create-todolist/create-todolist.component';


@NgModule({
  declarations: [TodolistsComponent, ViewTodolistsComponent, CreateTodolistComponent],
  imports: [
    CommonModule,
    TodolistsRoutingModule
  ]
})
export class TodolistsModule { }
