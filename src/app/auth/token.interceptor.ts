// tslint:disable:no-any

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthService.token}`
      }
    });

    return next.handle(authRequest);
  }
}
