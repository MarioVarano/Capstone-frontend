import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtentiRoutingModule } from './utenti-routing.module';
import { UtentiComponent } from './utenti.component';


@NgModule({
  declarations: [
    UtentiComponent
  ],
  imports: [
    CommonModule,
    UtentiRoutingModule
  ]
})
export class UtentiModule { }
