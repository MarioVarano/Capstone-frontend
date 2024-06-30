import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfessionistaComponent } from './pages/professionista/professionista.component';

const routes: Routes = [{ path: '', component: HomeComponent },
  { path: 'Professionisti', component: ProfessionistaComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
 }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
