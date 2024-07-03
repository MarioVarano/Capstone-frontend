import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { ProfessionalComponent } from './professional.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfessionalComponent
  ],
  imports: [
    CommonModule,
    ProfessionalRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfessionalModule { }
