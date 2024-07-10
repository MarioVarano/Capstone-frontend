import { AppointmentService } from '../../services/appuntamenti.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IProfessionista } from '../../Models/iprofessionista';
import { ProfessionistiService } from '../../services/professionisti.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IProfessionistaAppuntamentoDto } from '../../Models/i-professionista-appuntamento-dto';
import { IAppuntamento } from '../../Models/iappuntamento';
import { IGeneralResponse } from '../../Models/igeneral-response';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss']
})
export class ProfessionalComponent implements OnInit {
  currentProfessional!: IProfessionista;
  appointments: IProfessionistaAppuntamentoDto[] = [];
  message: string | null = null;
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  avatar: string = "";
  selectedAppointment: Partial<IProfessionistaAppuntamentoDto> | null = null;

  @ViewChild('editProfileModal')
  editProfileModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal')
  confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('editAppointmentModal')
  editAppointmentModal!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private professionistaService: ProfessionistiService,
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {

    const userId = this.authService.getUserId();
    if (userId) {
      this.professionistaService.getProfessionistaById(userId).subscribe({
        next: (currentProfessional) => {
          this.currentProfessional = currentProfessional;
          this.avatar = this.currentProfessional.avatar || "";
          this.loadProfessionalAppointments(userId);

        },

        error: (err) => console.error('Failed to load professional details', err),
      });
    }
  }

  loadProfessionalAppointments(professionalId: number): void {
    this.appointmentService.getAppointmentsByProfessionalId(professionalId).subscribe({
      next: (appointments: IProfessionistaAppuntamentoDto[]) => {
        this.appointments = appointments;
        console.log(this.appointments);
      },
      error: (err) => console.error('Failed to load professional appointments', err),
    });
  }

  openEditAppointmentModal(appointment: IProfessionistaAppuntamentoDto): void {
    console.log("-----------------------------", appointment);

    this.selectedAppointment = {
      id: appointment.id,
      dataPrenotazione: appointment.dataPrenotazione!,
      oraPrenotazione: appointment.oraPrenotazione!,
      confermato: appointment.confermato!,
      utente: appointment.utente
    }; // Clona l'appuntamento selezionato
    this.modalService.open(this.editAppointmentModal);
    console.log("-----------------------------", this.selectedAppointment);
  }

  saveAppointmentChanges(): void {
    if (this.selectedAppointment) {
      const payload: IAppuntamento = {
        id: this.selectedAppointment.id!,
        idProfessionista: this.currentProfessional.id!,
        idUtente: this.selectedAppointment.utente?.id!,
        dataPrenotazione: this.selectedAppointment.dataPrenotazione!,
        oraPrenotazione: this.selectedAppointment.oraPrenotazione!,
        confermato: this.selectedAppointment.confermato!
      };

      if (payload.id !== undefined) {
        this.appointmentService.updateAppointment(payload.id, payload).subscribe({
          next: (response: IGeneralResponse<IAppuntamento>) => {

            if (response.errorMessage) {

              this.errorMessage = response.errorMessage;
            } else {
              const updatedAppointment = response.data;
              if (updatedAppointment) {
                const index = this.appointments.findIndex(a => a.id === payload.id);
                if (index !== -1) {
                  this.appointments[index] = {
                    ...this.appointments[index],
                    dataPrenotazione: updatedAppointment.dataPrenotazione,
                    oraPrenotazione: updatedAppointment.oraPrenotazione,
                    confermato: this.appointments[index].confermato,
                    utente: this.appointments[index].utente
                  };
                }
                this.errorMessage = null; // Rimuovi l'errore
                this.modalService.dismissAll();

              } else {
                console.error('Failed to update appointment: ', response.errorMessage);
              }
            }
          },
          error: (err) => {
            console.error('Failed to update appointment', err);
            this.errorMessage = err;
            if (err.status === 401) {
              alert('Sessione scaduta. Effettua il login.');
            }
          },
        });
      } else {
        console.error('Appointment ID is undefined.');
      }
    } else {
      console.error('Selected appointment or its ID is undefined.');
    }
  }



  confirmDeleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a.id !== appointmentId);
      },
      error: (err) => console.error('Failed to delete appointment', err),
    });
  }

  uploadAvatar(): void {
    if (this.selectedFile) {
      console.log(this.selectedFile, "1", this.currentProfessional.id);

      this.professionistaService.uploadAvatar(this.currentProfessional.id, this.selectedFile).subscribe(
        url => {
          this.avatar  = this.currentProfessional.avatar = url;

          // Aggiorna il profilo dell'utente con il nuovo URL dell'avatar
          this.saveChanges();

          // Reset the file input
          this.selectedFile = null;
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          fileInput.value = '';
          console.log('Avatar uploaded successfully', url);
        },
        error => console.error('Failed to upload avatar', error)
      );
    }
  }

  openEditProfileModal(): void {
    this.modalRef = this.modalService.open(this.editProfileModal);
  }

  openConfirmDeleteModal(): void {
    this.modalRef = this.modalService.open(this.confirmDeleteModal);
  }

  confirmDelete():void {
    if (this.currentProfessional) {
      console.log(this.currentProfessional);

      this.professionistaService.deleteProfessionista(this.currentProfessional.id).subscribe({
        next: (response) => {
          console.log(response);

          this.message = response;
          console.log(this.message);

          this.modalRef.close();
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Failed to delete profile';
        }
      });
    }
  }

  saveChanges(): void {
    if (this.currentProfessional) {
      this.professionistaService.updateProfessionista(this.currentProfessional.id, this.currentProfessional).subscribe({
        next: (updatedProfessional) => {
          this.currentProfessional = updatedProfessional;
          if (this.modalRef) {
            this.modalRef.close();
          }
        },
        error: (err) => console.error('Failed to update profile', err),
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadAvatar();
    }
  }

  deleteAvatar(): void {
    this.professionistaService.deleteAvatar(this.currentProfessional.id).subscribe(
      response => {
        this.currentProfessional.avatar = ''; // Rimuovi l'URL dell'avatar
        console.log('Avatar deleted successfully', response);
      },
      error => console.error('Failed to delete avatar', error)
    );
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
}
