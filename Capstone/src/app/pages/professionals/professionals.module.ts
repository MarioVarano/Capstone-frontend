import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalsRoutingModule } from './professionals-routing.module';
import { ProfessionalsComponent } from './professionals.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfessionalsComponent
  ],
  imports: [
    CommonModule,
    ProfessionalsRoutingModule,
    FormsModule
  ]
})
export class ProfessionalsModule { }
