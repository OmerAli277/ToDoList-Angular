import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodolistsComponent } from './todolists.component';
import { ViewTodolistsComponent } from './view-todolists/view-todolists.component';
import { CreateTodolistComponent } from './create-todolist/create-todolist.component'

const routes: Routes = [
  { path: '', component: ViewTodolistsComponent },
  { path: 'create', component: CreateTodolistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodolistsRoutingModule { }
