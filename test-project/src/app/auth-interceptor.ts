import { Injectable } from '@angular/core';
import { HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { InterceptorSkip } from './skipHeaders';



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
        return next.handle(authReq).pipe(
            catchError(this.handleError)
        );
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      if(error.error.type === '1'){
          this.router.navigate(['Login']);
      }
    }

    // Return an observable with a user-facing error message.
    return throwError(error.error.message);
  }
}