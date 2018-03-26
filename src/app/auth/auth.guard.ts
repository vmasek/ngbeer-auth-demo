import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UNAUTHORIZED } from 'http-status-codes';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {
  }

  canActivate(): boolean {
    if (this.auth.isTokenValid) {
      return true;
    }

    this.router.navigate([UNAUTHORIZED.toString()], {
      queryParams: {guardIsYelling: 'you-shell-not-pass'}
    });
    return true;
  }
}
