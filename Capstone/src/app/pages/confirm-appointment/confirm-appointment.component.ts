import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appuntamenti.service';

@Component({
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrl: './confirm-appointment.component.scss'
})
export class ConfirmAppointmentComponent implements OnInit {

  appointmentId: number | null = null;
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
    const idParam = this.route.snapshot.queryParamMap.get('appointmentId');
    this.appointmentId = idParam ? +idParam : null;
    if (this.appointmentId) {
      this.appointmentService.confirmAppointment(this.appointmentId).subscribe({
        next: (response) => {
          console.log(response);
          this.success = true;
          this.loading = false;
          this.successMessage = 'Appuntamento confermato con successo!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000); // Reindirizza alla homepage dopo 3 secondi
        },
        error: (err) => {
          console.error('Errore nella conferma dell\'appuntamento', err);
          this.success = false;
          this.errorMessage = 'Errore nella conferma dell\'appuntamento. Riprova più tardi.';
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.errorMessage = 'ID dell\'appuntamento non valido.';
    }
  }

}
