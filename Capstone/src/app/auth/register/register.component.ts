import { Component } from '@angular/core';
import { IProfessionista } from '../../Models/iprofessionista';
import { Router } from '@angular/router';
import { IUser } from '../../Models/iUser';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  registerUserData: Partial<IUser> = {};
  registerProfessionistaData: Partial<IProfessionista> = {};
  isProfessionista: boolean = false;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {}

  register() {
    if (this.isProfessionista) {
      // Copia i dati comuni da registerUserData a registerBarmanData
      this.registerProfessionistaData = {
        ...this.registerUserData,
        ...this.registerProfessionistaData
      } as Partial<IProfessionista>;

      console.log('Professionista Data:', this.registerProfessionistaData); // Log dei dati barman

      this.authSvc.registerProfessionista(this.registerProfessionistaData).subscribe(
        data => this.router.navigate(['']),
        error => console.error('Professionista registration failed', error) // Log dell'errore
      );
    } else {
      console.log('User Data:', this.registerUserData); // Log dei dati user

      this.authSvc.registerUser(this.registerUserData).subscribe(
        data => this.router.navigate(['']),
        error => console.error('User registration failed', error) // Log dell'errore
      );
    }
  }

}
