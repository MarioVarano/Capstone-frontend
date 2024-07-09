import { AppointmentService } from '../../services/appuntamenti.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from '../../Models/iUser';
import { IAppuntamento } from '../../Models/iappuntamento';
import { IUtenteAppuntamentoDto } from '../../Models/i-utente-appuntamento-dto';
import { IGeneralResponse } from '../../Models/igeneral-response';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentUser!: IUser;
  errorMessage: string | null = null;
  appointments: IUtenteAppuntamentoDto[] = [];
  selectedFile: File | null = null;
  avatar: string | null = null;
  selectedAppointment: Partial<IAppuntamento> | null = null;


  @ViewChild('editAppointmentModal') editAppointmentModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteAppointmentModal!: TemplateRef<any>;

  @ViewChild('editProfileModal')
  editProfileModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal')
  confirmDeleteModal!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (currentUser) => {
          this.currentUser = currentUser;
          this.avatar = currentUser.avatar || "";
          this.loadUserAppointments(userId);


        },
        error: (err) => console.error('Failed to load user details', err),
      });
    }
  }

  loadUserAppointments(userId: number): void {
    this.appointmentService.getAppointmentsByUserId(userId).subscribe({
      next: (appointments: IUtenteAppuntamentoDto[]) => {
        this.appointments = appointments;
        console.log(this.appointments);

      },
      error: (err) => console.error('Failed to load user appointments', err),
    });
  }

  openEditAppointmentModal(appointment: IUtenteAppuntamentoDto): void {
    console.log("-----------------------------", appointment);

    this.selectedAppointment = {
      id: appointment.id,
      idProfessionista: appointment.professionista.id!,
      idUtente:this.currentUser.id!,
      dataPrenotazione: appointment.dataPrenotazione!,
      oraPrenotazione: appointment.oraPrenotazione!,
      confermato: appointment.confermato!
    }; // Clona l'appuntamento selezionato
    this.modalService.open(this.editAppointmentModal);
    console.log("-----------------------------", this.selectedAppointment);
  }


  saveAppointmentChanges(): void {
    if (this.selectedAppointment) {
      const payload: IAppuntamento = {
        id: this.selectedAppointment.id!,
        idProfessionista: this.selectedAppointment.idProfessionista!,
        idUtente: this.selectedAppointment.idUtente!,
        dataPrenotazione: this.selectedAppointment.dataPrenotazione!,
        oraPrenotazione: this.selectedAppointment.oraPrenotazione!,
        confermato: this.selectedAppointment.confermato!
      };
      console.log(payload);

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
                    confermato: this.appointments[index].confermato, // Mantieni lo stato confermato
                    professionista: this.appointments[index].professionista // Mantieni i dettagli del professionista
                  };
                }
                if (this.modalRef) {
                  this.modalRef.close();
                }
                this.errorMessage = null;
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
      this.userService.uploadAvatar(this.currentUser.id, this.selectedFile).subscribe(
        url => {
          this.avatar = this.currentUser.avatar = url;
          this.saveChanges();
          this.selectedFile = null;
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          fileInput.value = '';
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

  confirmDelete(): void {
    if (this.currentUser) {
      this.userService.deleteUser(this.currentUser.id).subscribe({
        next: (response) => {
          this.modalRef.close();
          this.authService.logout();
        },
        error: (err) => console.error('Failed to delete profile', err),
      });
    }
  }

  saveChanges(): void {
    if (this.currentUser) {
      this.userService.updateUser(this.currentUser.id, this.currentUser).subscribe({
        next: (updatedUser) => {
          this.currentUser = updatedUser;
          if (this.modalRef) {
            this.modalRef.close();
          }
        },
        error: (err) => console.error('Failed to update profile', err),
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadAvatar();
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }


  logout() {
    this.authService.logout();
  }

  deleteAvatar(): void {
    this.userService.deleteAvatar(this.currentUser.id).subscribe(
      response => {
        this.currentUser.avatar = ''; // Rimuovi l'URL dell'avatar
        console.log('Avatar deleted successfully', response);
      },
      error => console.error('Failed to delete avatar', error)
    );
  }
}
