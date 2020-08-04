import { Injectable } from '@angular/core';
import { HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { InterceptorSkip } from './skipHeaders';
import { Router } from '@angular/router';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
      private auth: AuthenticationService,
      private router: Router
      ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.headers && req.headers.has(InterceptorSkip)) {
        const headers = req.headers.delete(InterceptorSkip);
        return next.handle(req.clone({ headers }));
    }
    else {
        // Get the auth token from the service.
        const authToken = localStorage.getItem("id_token");
        let authReq;
        if(authToken){
            // Clone the request and replace the original headers with
            // cloned headers, updated with the authorization.
            authReq = req.clone({
                headers: req.headers.set('Authorization', authToken)
            });
        }

        // send cloned request with header to the next handler.
        return next.handle(authReq)
        .pipe(
          catchError((err: Error | any) => {

            if (err.error instanceof ErrorEvent) {
              // A client-side or network error occurred. Handle it accordingly.
              console.error('An error occurred:', err.error.message);
            }
            else if( err instanceof HttpErrorResponse){
              if(err.status === 401)
              {
                if(authToken){
                  this.router.navigate(['login'], { queryParams: { unauthorized: 'Session has expired login again.' } });
                }
                else{
                  this.router.navigate(['login'], { queryParams: { unauthorized: 'You are not authorized to access this page. login First.' } });
                }
                this.auth.logout();
              }
              return throwError(err.error.message);
            }
            // Return an observable with a user-facing error message.
            return throwError(err.error.message);
          })
        );
    }
  }
}