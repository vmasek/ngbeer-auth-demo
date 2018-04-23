import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

function randomString(seed?: number): string {
  if (seed == null) {
    seed = Math.random();
  }
  return seed.toString(36).substr(2, 5);
}

@Component({
  selector: 'br-auth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly http: HttpClient,
              private readonly auth: AuthService) {
  }

  login(): void {
    this.auth.login('yolan@email.com', 'yolan');
  }

  logout(): void {
    this.auth.logout();
  }

  getProducts(): void {
    this.http.get('http://localhost:3000/products')
      .subscribe(
        data => console.info(data),
        (err: Error) => console.error(err)
      );
  }

  postProduct(): void {
    const seed = Math.random();
    const product = {
      name: randomString(seed),
      cost: Math.floor((seed * 100) + 1),
      quantity: Math.floor((seed * 10) + 1),
      locationId: Math.floor((seed * 3) + 1),
      familyId: Math.floor((seed * 3) + 1)
    };

    this.http.post(`http://localhost:3000/products`, product)
      .subscribe(
        data => console.info('product has been added', data),
        (err: Error) => console.error('product could not be added', err)
      );
  }
}
