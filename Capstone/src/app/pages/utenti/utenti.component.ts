import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IUser } from '../../Models/iUser';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html'
})
export class UtentiComponent implements OnInit {
  user: IUser = {
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    city: '',
    avatar: '' // Path all'immagine del profilo
  };
  selectedFile?: File;
  defaultImage: string = 'assets/default-avatar.png'; // Path all'immagine di default

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(data => {
      this.user = data;
    });
  }

  onUpdate(): void {
    this.userService.updateUserProfile(this.user).subscribe(response => {
      // Gestisci la risposta, es. mostrare un messaggio di successo
    });
  }

  onDelete(): void {
    this.userService.deleteUserProfile().subscribe(response => {
      // Gestisci la risposta, es. reindirizzare alla pagina di login
      this.router.navigate(['/login']);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.userService.uploadProfileImage(fd).subscribe(res => {
        // Aggiorna l'immagine del profilo
        this.user.avatar = res.imagePath;
      });
    }
  }
}
