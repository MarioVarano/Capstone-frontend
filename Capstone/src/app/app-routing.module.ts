import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  { path: 'utenti', loadChildren: () => import('./pages/utenti/utenti.module').then(m => m.UtentiModule) },
  { path: 'professionisti', loadChildren: () => import('./pages/professionisti/professionisti.module').then(m => m.ProfessionistiModule) },
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
