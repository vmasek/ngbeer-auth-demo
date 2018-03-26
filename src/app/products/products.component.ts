import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';

interface Products {
  cost: number;
  familyId: number;
  id: number;
  locationId: number;
  name: string;
  quantity: number;
}

@Component({
  selector: 'br-auth-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  readonly products$ = this.http.get<Products[]>('http://localhost:3000/products')
    .pipe(tap((data) => console.log(data)));

  constructor(private readonly http: HttpClient) {
  }
}
