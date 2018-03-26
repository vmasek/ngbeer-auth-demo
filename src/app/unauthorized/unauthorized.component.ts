import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'br-auth-unauthorized',
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  guardIsYelling$ = this.route.queryParams.pipe(map(({guardIsYelling}) => guardIsYelling));

  constructor(public route: ActivatedRoute) {
  }
}
