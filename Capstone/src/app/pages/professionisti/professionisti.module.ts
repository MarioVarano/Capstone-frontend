import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Assicurati di avere FormsModule

import { ProfessionistiRoutingModule } from './professionisti-routing.module';
import { ProfessionistiComponent } from './professionisti.component';

@NgModule({
  declarations: [
    ProfessionistiComponent
  ],
  imports: [
    CommonModule,
    ProfessionistiRoutingModule,
    FormsModule // Assicurati di avere FormsModule
  ]
})
export class ProfessionistiModule { }
