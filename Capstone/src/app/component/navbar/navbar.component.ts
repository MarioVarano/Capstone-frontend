import { Component, OnInit, HostListener } from '@angular/core';
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const logo = document.querySelector('.logo') as HTMLElement;
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
      logo.classList.add('large');
    } else {
      navbar.classList.remove('scrolled');
      logo.classList.remove('large');
    }
  }

  logout() {
    this.authSvc.logout();
    this.isUserLoggedIn = false;
  }
}
