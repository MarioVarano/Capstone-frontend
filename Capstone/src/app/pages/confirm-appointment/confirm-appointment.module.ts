import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmAppointmentRoutingModule } from './confirm-appointment-routing.module';
import { ConfirmAppointmentComponent } from './confirm-appointment.component';


@NgModule({
  declarations: [
    ConfirmAppointmentComponent
  ],
  imports: [
    CommonModule,
    ConfirmAppointmentRoutingModule
  ]
})
export class ConfirmAppointmentModule { }
