import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IUser } from '../../Models/iUser';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html'
})
export class UtentiComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  user: IUser | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const userId = 1; // ID dell'utente da caricare
    this.userService.getById(userId).subscribe(
      (userData: IUser) => {
        this.user = userData;
      },
      error => {
        console.error('Error loading user', error);
      }
    );
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        console.error('File is not an image');
        return;
      }

      this.userService.uploadAvatar(this.user!.username, file).subscribe(
        response => {
          this.user!.avatar = response;
        },
        error => {
          console.error('Error uploading avatar', error);
        }
      );
    }
  }

  editUser(): void {
    // Implementa la logica di modifica dell'utente
    console.log('Modifica utente');
  }

  deleteUser(): void {
    this.userService.deleteUser(this.user!.id).subscribe(
      () => {
        console.log('Utente cancellato');
      },
      error => {
        console.error('Error deleting user', error);
      }
    );
  }
}
