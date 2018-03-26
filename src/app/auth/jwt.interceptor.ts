// tslint:disable:no-any

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {
          /* ... */
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case UNAUTHORIZED:
                console.warn('You have just made an unauthorized API call', err);
                this.router.navigateByUrl(UNAUTHORIZED.toString());
                break;
              case NOT_FOUND:
                console.warn('You cannot hit something that doesn\'t exist', err);
                this.router.navigateByUrl(NOT_FOUND.toString());
            }
          }
        })
    );
  }
}
