import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appuntamenti.service';

@Component({
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrl: './confirm-appointment.component.scss'
})
export class ConfirmAppointmentComponent implements OnInit {

  loading = true;
  success: boolean | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.queryParamMap.get('id');
    if (appointmentId) {
      this.appointmentService.confirmAppointment(+appointmentId).subscribe({
        next: (response) => {
          this.success = true;
          this.loading = false;
          this.successMessage = response;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorMessage = 'Errore nella conferma dell\'appuntamento. Devi effettuare il login per vedere la conferma.';
          } else {
            this.errorMessage = 'Errore nella conferma dell\'appuntamento. Riprova più tardi.';
          }
          this.success = false;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.errorMessage = 'ID dell\'appuntamento non valido.';
    }
}


}
