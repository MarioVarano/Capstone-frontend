import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessionistiComponent } from './professionisti.component';

const routes: Routes = [{ path: '', component: ProfessionistiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionistiRoutingModule { }
