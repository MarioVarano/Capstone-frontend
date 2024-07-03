// src/app/auth/guest.guard.ts
import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/user-profile']);
      return false;
    }
  }
}
