import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, retry, tap, shareReplay } from 'rxjs/operators';

import { User } from './models/user.model';
import { Message } from './models/message.model';
import { InterceptorSkipHeader } from './skipHeaders';




@Injectable({
  providedIn: 'root'
})
export class TodolistService {

  private registerUrl = '/api/user/register';
  private checkemailUrl = '/api/user/checkemail';

  constructor(
    private http: HttpClient
  ) { }

  register(user: User) {
    console.log(user);
    return this.http.post<Message>(this.registerUrl, user , { headers: InterceptorSkipHeader })
    .pipe(
      shareReplay(),
    );
  }

  checkemail(email: string){
    return this.http.post<Message>(this.checkemailUrl, { email }, { headers: InterceptorSkipHeader })
    .pipe(
      shareReplay(),
    );
  }
}
