import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UserGuard } from './auth/user.guard';
import { ProfessionalGuard } from './auth/professional.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'user-profile', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard, UserGuard] },
  { path: 'professional-profile', loadChildren: () => import('./pages/professional/professional.module').then(m => m.ProfessionalModule), canActivate: [AuthGuard, ProfessionalGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
