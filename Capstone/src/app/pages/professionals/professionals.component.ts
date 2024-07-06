import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IProfessionista } from '../../Models/iprofessionista';
import { ProfessionistiService } from '../../services/professionisti.service';
import { IAppuntamento } from '../../Models/iappuntamento';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../services/appuntamenti.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-professionals',
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.scss'
})
export class ProfessionalsComponent implements OnInit {
  professionisti: IProfessionista[] = [];
  selectedProfessional: IProfessionista | null = null;
  appointment: Partial<IAppuntamento> = {
    id: 0,
    idProfessionista:0,
    idUtente:0,
    dataPrenotazione: '',
    oraPrenotazione: '',
    confermato: false
  };
  modalRef: NgbModalRef | null = null;
  errorMessage: string = '';


  @ViewChild('appointmentModal')
  appointmentModal!: TemplateRef<any>;

  constructor(
    private authService: AuthService,  // Assicurati di avere un metodo per ottenere l'ID dell'utente loggato
    private professionistiService: ProfessionistiService,
    private modalService: NgbModal,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.professionistiService.getProfessionisti().subscribe({
      next: (data) => {
        this.professionisti = data;
      },
      error: (err) => console.error('Failed to load professionals', err)
    });
  }

  openAppointmentModal(professional: IProfessionista): void {
    this.selectedProfessional = professional;
    this.modalRef = this.modalService.open(this.appointmentModal);
  }

  bookAppointment(): void {
    const userId = this.authService.getUserId();
    console.log(userId);

    if (this.selectedProfessional && this.appointment.dataPrenotazione && this.appointment.oraPrenotazione && userId !== null) {
      const appointmentData: IAppuntamento = {
        idProfessionista: this.selectedProfessional.id,

        idUtente: userId,

        dataPrenotazione: this.appointment.dataPrenotazione,
        oraPrenotazione: this.appointment.oraPrenotazione,
        confermato: false
      };

      this.appointmentService.bookAppointment(appointmentData).subscribe({
        next: (response) => {
          console.log('Appointment booked successfully', response);
          if (this.modalRef) {
            this.modalRef.close();
          }
        },
        error: (err) => {
          console.error('Failed to book appointment', err);
          this.errorMessage = err.error
        },
      });
    }

  }
}
