import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

 // professional.guard.ts

canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> {
  return this.authService.user$.pipe(
    map(user => {
      const isUserProfessional = !!user && !!this.authService.specializzazione;
      if (!isUserProfessional) {
        this.router.navigate(['']);
      }
      return isUserProfessional;
    })
  );
}

}
