import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtentiRoutingModule } from './utenti-routing.module';
import { UtentiComponent } from './utenti.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UtentiComponent
  ],
  imports: [
    CommonModule,
    UtentiRoutingModule,
    FormsModule
  ]
})
export class UtentiModule { }
