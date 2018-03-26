import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  static readonly TOKEN_SELECTOR = 'fancy-token-selector-string';

  static get token(): string | null {
    return localStorage.getItem(this.TOKEN_SELECTOR);
  }

  static set token(token: string | null) {
    if (!token) {
      localStorage.removeItem(this.TOKEN_SELECTOR);
    } else {
      localStorage.setItem(this.TOKEN_SELECTOR, token);
    }
  }

  get isTokenValid(): boolean {
    const token = AuthService.token;
    return token ? tokenNotExpired(AuthService.TOKEN_SELECTOR, token) : false;
  }
}
