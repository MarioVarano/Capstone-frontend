import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppuntamentiComponent } from './appuntamenti.component';

const routes: Routes = [{ path: '', component: AppuntamentiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppuntamentiRoutingModule { }
