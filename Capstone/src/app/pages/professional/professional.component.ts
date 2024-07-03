import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IProfessionista } from '../../Models/iprofessionista';
import { ProfessionistiService } from '../../services/professionisti.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss']
})
export class ProfessionalComponent implements OnInit {
  currentProfessional!: IProfessionista;
  appointments: any[] = [];
  message: string | null = null;
  errorMessage: string | null = null;

  @ViewChild('editProfileModal')
  editProfileModal!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private professionistaService: ProfessionistiService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.professionistaService.getProfessionistaById(userId).subscribe({
        next: (currentProfessional) => (this.currentProfessional = currentProfessional),
        error: (err) => console.error('Failed to load professional details', err),
      });
     // this.loadAppointments(userId);
    }
  }

  //loadAppointments(profId: number): void {
  //  this.professionistaService.getAppointments(profId).subscribe({
  //    next: (appointments) => (this.appointments = appointments),
  //    error: (err) => console.error('Failed to load appointments', err),
  //  });
  //}

  uploadAvatar(): void {
    // Logica per caricare l'immagine dell'avatar
  }

  openEditProfileModal(): void {
    this.modalRef = this.modalService.open(this.editProfileModal);
  }

  saveChanges(): void {
    if (this.currentProfessional) {
      this.professionistaService.updateProfessionista(this.currentProfessional.id, this.currentProfessional).subscribe({
        next: (updatedProfessional) => {
          this.currentProfessional = updatedProfessional;
          this.modalRef.close();
        },
        error: (err) => console.error('Failed to update profile', err),
      });
    }
  }

  deleteProfile(): void {
    if (this.currentProfessional) {
      this.professionistaService.deleteProfessionista(this.currentProfessional.id).subscribe({
        next: (response) => {
          this.message = response.message;
          this.authService.logout();
          this.router.navigate(['/']); // reindirizzare dopo la cancellazione
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Failed to delete profile';
        }
      });
    }
  }
}
