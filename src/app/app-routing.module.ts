import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { NotFoundComponent } from './not-found/not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
  {path: UNAUTHORIZED.toString(), pathMatch: 'full', component: UnauthorizedComponent},
  {path: NOT_FOUND.toString(), pathMatch: 'full', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
