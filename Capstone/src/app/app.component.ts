import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'Capstone';

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
    this.authService.restoreUser();
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      localStorage.removeItem('returnUrl');
    }
  }
}
