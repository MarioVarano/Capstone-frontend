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
  errorMessage: string | null = null;

  constructor(private authSvc: AuthService, private router: Router) {}

  register() {
    if (this.isProfessionista) {
      // Copia i dati comuni da registerUserData a registerProfessionistaData
      this.registerProfessionistaData = {
        ...this.registerUserData,
        ...this.registerProfessionistaData
      } as Partial<IProfessionista>;

      this.authSvc.registerProfessionista(this.registerProfessionistaData).subscribe({
        next: (data) => this.router.navigate(['auth/login']),
        error: (error) => {
          console.error('Professionista registration failed', error);
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    } else {
      this.authSvc.registerUser(this.registerUserData).subscribe({
        next: (data) => this.router.navigate(['auth/login']),
        error: (error) => {
          console.error('User registration failed', error);
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error.error) {
      switch (error.error) {
        case 'Email and Password are required':
          return 'Email e password obbligatorie';
        case 'Email already exists':
          return 'Utente esistente';
        case 'Email format is invalid':
          return 'Email scritta male';
        case 'Cannot find user':
          return 'Utente inesistente';
        default:
          return 'Errore';
      }
    }
    return 'Errore sconosciuto';
  }

}
