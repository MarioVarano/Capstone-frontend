import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IProfessionista } from '../../Models/iprofessionista';
import { ProfessionistiService } from '../../services/professionisti.service';
import { IAppuntamento } from '../../Models/iappuntamento';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../services/appuntamenti.service';
import { AuthService } from '../../auth/auth.service';
import { IGeneralResponse } from '../../Models/igeneral-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professionals',
  templateUrl: './professionals.component.html',
  styleUrls: ['./professionals.component.scss']
})
export class ProfessionalsComponent implements OnInit {
  professionisti: IProfessionista[] = [];
  professionistiFiltrati: IProfessionista[] = [];
  selectedProfessional: IProfessionista | null = null;
  appointment: Partial<IAppuntamento> = {
    id: 0,
    idProfessionista: 0,
    idUtente: 0,
    dataPrenotazione: '',
    oraPrenotazione: '',
    descrizione: '',
    confermato: false
  };
  isLoggedIn = false;
  searchCity: string = '';
  searchSpecializzazione: string = '';

  modalRef: NgbModalRef | null = null;
  errorMessage: string | null = null;

  @ViewChild('appointmentModal')
  appointmentModal!: TemplateRef<any>;

  constructor(
    private authService: AuthService,
    private professionistiService: ProfessionistiService,
    private modalService: NgbModal,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getUserId();
    this.getProfessionisti();
  }

  getProfessionisti(): void {
    this.professionistiService.getProfessionisti().subscribe({
      next: (data) => {
        this.professionisti = data;
        this.professionistiFiltrati = data;
      },
      error: (err) => console.error('Failed to load professionals', err)
    });
  }

  onSearch(): void {
    this.professionistiFiltrati = this.professionisti.filter(professionista => {
      const matchesCity = this.searchCity ? professionista.city.toLowerCase().includes(this.searchCity.toLowerCase()) : true;
      const matchesSpecializzazione = this.searchSpecializzazione ? professionista.specializzazione.toLowerCase().includes(this.searchSpecializzazione.toLowerCase()) : true;
      return matchesCity && matchesSpecializzazione;
    });
  }

  openAppointmentModal(professional: IProfessionista): void {
    this.selectedProfessional = professional;
    this.modalRef = this.modalService.open(this.appointmentModal);
  }

  bookAppointment(): void {
    if (this.selectedProfessional && this.appointment.dataPrenotazione && this.appointment.oraPrenotazione) {
      const appointmentData: IAppuntamento = {
        idProfessionista: this.selectedProfessional.id,
        idUtente: this.authService.getUserId() ?? 0,
        dataPrenotazione: this.appointment.dataPrenotazione,
        oraPrenotazione: this.appointment.oraPrenotazione,
        descrizione: this.appointment.descrizione,  // Aggiungi descrizione
        confermato: false
      };
      this.appointmentService.bookAppointment(appointmentData).subscribe({
        next: (response: IGeneralResponse<IAppuntamento>) => {
          if (response.errorMessage) {
            this.errorMessage = response.errorMessage;
          } else {
            console.log('Appointment booked successfully', response);
            this.errorMessage = null;
            if (this.modalRef) {
              this.modalRef.close();
            }
          }
        },
        error: (err) => {
          console.error('Failed to book appointment', err);
          this.errorMessage = err;
        }
      });
    }
  }

  redirectToHome(): void {
    this.router.navigate(['/']);
  }
}
