import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppuntamentiRoutingModule } from './appuntamenti-routing.module';
import { AppuntamentiComponent } from './appuntamenti.component';


@NgModule({
  declarations: [
    AppuntamentiComponent
  ],
  imports: [
    CommonModule,
    AppuntamentiRoutingModule
  ]
})
export class AppuntamentiModule { }
