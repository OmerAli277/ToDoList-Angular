import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, shareReplay } from 'rxjs/operators';
import * as moment from "moment";
import { tokenName } from '@angular/compiler';
import { InterceptorSkipHeader } from './skipHeaders';
import { Message } from './models/message.model';

interface User {
  tokenName: String;
  expiresIn: String;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loginUrl = '/api/auth/token/obtain'
  checkemailUrl = '/api/user/checkemail'


  constructor(
    private http: HttpClient
  ) { }

  checkemail(email: string){
    return this.http.post<Message>(this.checkemailUrl, { email }, { headers: InterceptorSkipHeader });
    // .pipe(
    //   shareReplay(),
    //   catchError(this.handleError)
    // );
  }

  login(email:string, password:string ) {
    return this.http.post<User>(this.loginUrl, {email, password}, { headers : InterceptorSkipHeader })
    .pipe(
      tap(res=>this.setSession),
      shareReplay(),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );

    console.error("User Logged In >....\n\n\n\n" + authResult.idToken);
  }          

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }    
}
