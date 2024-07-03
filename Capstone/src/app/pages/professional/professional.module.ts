import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { ProfessionalComponent } from './professional.component';


@NgModule({
  declarations: [
    ProfessionalComponent
  ],
  imports: [
    CommonModule,
    ProfessionalRoutingModule
  ]
})
export class ProfessionalModule { }
