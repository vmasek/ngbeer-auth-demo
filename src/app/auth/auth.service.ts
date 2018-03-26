import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import * as moment from 'moment';
import { Observable } from 'rxjs';

const TOKEN_REFRESH_THRESHOLD = 3; // how many minutes before expiration should be token refreshed

@Injectable()
export class AuthService {

  static readonly TOKEN_SELECTOR = 'fancy-token-selector-string';
  static readonly jwtHelper = new JwtHelper();


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

  constructor(private readonly http: HttpClient) {
    const token = AuthService.token;
    if (token) {
      const expiration = moment(AuthService.jwtHelper.getTokenExpirationDate(token));
      const now = moment();
      if (expiration.isAfter(now)) {
        if (expiration.isBefore(now.add(TOKEN_REFRESH_THRESHOLD, 'minutes'))) {
          this.refreshToken();
        } else {
          this.refreshTokenWithTimeout();
        }
      }
    }
  }

  refreshTokenWithTimeout(): void {
    const expiration = moment(AuthService.jwtHelper.getTokenExpirationDate(AuthService.token || ''));
    const refreshTimeout = moment.duration(expiration.diff(moment().add(TOKEN_REFRESH_THRESHOLD, 'minutes')));

    console.info('Token will be refreshed in', Math.floor(refreshTimeout.asSeconds()), 'seconds');
    Observable.timer(refreshTimeout.asMilliseconds())
      .subscribe(() => this.refreshToken());
  }

  refreshToken(): void {
    this.http.get<{ accessToken: string }>('http://localhost:3000/auth/refresh')
      .subscribe(
        ({accessToken}) => {
          console.info('Here is your new token', accessToken);
          AuthService.token = accessToken;
        }
      );
  }
}
