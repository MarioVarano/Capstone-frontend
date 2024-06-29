import { Component, TemplateRef } from '@angular/core';
import { IProfessionista } from '../../Models/iprofessionista';
import { Router } from '@angular/router';
import { IUser } from '../../Models/iUser';
import { AuthService } from '../auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
  closeResult: string = '';

  constructor(private modalService: NgbModal, private authSvc: AuthService, private router: Router) {}

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  register() {
    if (this.isProfessionista) {
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
