import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  isUserSimple: boolean = false;
  isUserProfessional: boolean = false;

  isNavbarCollapsed = true;
  userName: string | null = null;

  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.authSvc.isLoggedIn$.subscribe(data => {
      this.isUserLoggedIn = data;
      this.isUserSimple = this.authSvc.isUserSimple();
      this.isUserProfessional = this.authSvc.isUserProfessional();

      if (this.isUserLoggedIn) {
        this.userName = this.authSvc.getUserName();
      }
    });
  }

  logout() {
    this.authSvc.logout();
    this.isUserLoggedIn = false;
  }
}
