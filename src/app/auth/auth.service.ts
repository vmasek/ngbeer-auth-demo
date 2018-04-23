import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import * as moment from 'moment';
import { timer } from 'rxjs/observable/timer';

const TOKEN_REFRESH_THRESHOLD_MINUTES = 3; // how many minutes before expiration should be token refreshed


/**
 * This service will handle:
 *
 * - Getting the token from local storage
 * - Setting the token in local storage
 * - Checking if the token is expired
 * - HTTP Post to log us in
 */
@Injectable()
export class AuthService {

  static readonly TOKEN_SELECTOR = 'fancy-token-selector-string';
  static readonly jwtHelper = new JwtHelper();

  private readonly url = 'http://localhost:3000/';

  static get token(): string | null {
    return localStorage.getItem(this.TOKEN_SELECTOR);
  }

  static setToken(token: string | null = null): void {
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
        if (expiration.isBefore(now.add(TOKEN_REFRESH_THRESHOLD_MINUTES, 'minutes'))) {
          this.refreshToken();
        }
        this.refreshTokenWithTimeout();
      }
    }
  }

  login(email: string, password: string): void {
    this.http.post(`${this.url}auth/login`, {email, password})
      .subscribe(
        ({accessToken}: { accessToken: string }) => {
          console.info('Welcome back Yolan', accessToken);
          AuthService.setToken(accessToken);
          this.refreshTokenWithTimeout();
        }
      );
  }

  logout(): void {
    AuthService.setToken();
  }

  refreshTokenWithTimeout(): void {
    const expiration = moment(AuthService.jwtHelper.getTokenExpirationDate(AuthService.token || ''));
    const refreshTimeout = moment.duration(expiration.diff(moment().add(TOKEN_REFRESH_THRESHOLD_MINUTES, 'minutes')));

    console.info('Token will be refreshed in and every', Math.floor(refreshTimeout.asSeconds()), 'seconds');
    timer(refreshTimeout.asMilliseconds(), TOKEN_REFRESH_THRESHOLD_MINUTES * 60 * 1000)
      .subscribe(() => this.refreshToken());
  }

  refreshToken(): void {
    this.http.get<{ accessToken: string }>(`${this.url}auth/refresh`)
      .subscribe(
        ({accessToken}) => {
          console.info('Here is your new token', accessToken);
          AuthService.setToken(accessToken);
        }
      );
  }
}
