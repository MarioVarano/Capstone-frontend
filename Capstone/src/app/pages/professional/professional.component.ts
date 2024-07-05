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
  selectedFile: File | null = null;
  avatar: string = "";

  @ViewChild('editProfileModal')
  editProfileModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal')
  confirmDeleteModal!: TemplateRef<any>;
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
        next: (currentProfessional) => {

          this.currentProfessional = currentProfessional;

          this.avatar = this.currentProfessional.avatar || "";

        },
        error: (err) => console.error('Failed to load professional details', err),
      });
    }
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
