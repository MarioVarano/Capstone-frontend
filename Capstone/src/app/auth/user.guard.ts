import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        const isUserSimple = !!user && this.authService.specializzazione === "UTENTE";
        if (!isUserSimple) {
          localStorage.setItem('returnUrl', state.url);
          this.router.navigate(['']);
        }
        return isUserSimple;
      })
    );
  }
}
