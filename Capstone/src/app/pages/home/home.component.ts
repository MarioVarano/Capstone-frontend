import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { IUser } from '../../Models/iUser';
import { IProfessionista } from '../../Models/iprofessionista';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('loginModal') loginModal: any;
  @ViewChild('registrationModal') registrationModal: any;

  registerUserData: IUser = {} as IUser;
  registerProfessionistaData: IProfessionista = {} as IProfessionista;
  loginData: any = {};
  isProfessionista: boolean = false;
  errorMessage: string | null = null;

  private loginModalRef: NgbModalRef | undefined;
  private registrationModalRef: NgbModalRef | undefined;

  constructor(private modalService: NgbModal, private authSvc: AuthService, private router: Router) {}

  register(modal: NgbModalRef) {
    if (this.isProfessionista) {
      this.registerProfessionistaData = {
        ...this.registerUserData,
        specializzazione: this.registerProfessionistaData.specializzazione,
        descrizione: this.registerProfessionistaData.descrizione
      } as IProfessionista;

      this.authSvc.registerProfessionista(this.registerProfessionistaData).subscribe(
        data => {
          modal.dismiss('registered');
          this.openLoginModal();
        },
        error => {
          console.error('Professionista registration failed', error);
          this.errorMessage = error;
        }
      );
    } else {
      this.authSvc.registerUser(this.registerUserData).subscribe(
        data => {
          modal.dismiss('registered');
          this.openLoginModal();
        },
        error => {
          console.error('User registration failed', error);
          this.errorMessage = error;
        }
      );
    }
  }

  login(modal: NgbModalRef) {
    this.authSvc.login(this.loginData).subscribe(
      data => {

        modal.dismiss('logged in');
        this.errorMessage = null;

        if (data.loginResponseProfession?.specializzazione == "PROFESSIONISTA") {

          this.router.navigate(['/professional-profile']);
        } else {
          console.log("FRANZ");
          this.router.navigate(['/user-profile']);
        }
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = error;
      }
    );
  }


  openLoginModal() {
    if (this.registrationModalRef) {
      this.registrationModalRef.close();
    }
    this.loginModalRef = this.modalService.open(this.loginModal);
  }

  openRegistrationModal() {
    this.registrationModalRef = this.modalService.open(this.registrationModal);
  }
}
