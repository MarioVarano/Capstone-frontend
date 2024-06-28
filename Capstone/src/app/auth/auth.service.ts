import { Injectable } from '@angular/core';
import { IUserResponse } from '../Models/iUser-response';
import { IProfessionista } from '../Models/iprofessionista';
import { ILoginData } from '../Models/i-login-data';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { IUser } from '../Models/iUser';


type AccessData = {
  userResponse?: IUserResponse
  professionistaResponse?: IUserResponse
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper: JwtHelperService = new JwtHelperService();
  authSubject = new BehaviorSubject<IUser | IProfessionista | null>(null);
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map(user => !!user), tap(user => this.syncIsLoggedIn = user));
  syncIsLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  registerUserUrl: string = environment.registerUserUrl;
  registerProfessionistaUrl: string = environment.registerProfessionistaUrl;
  loginUrl: string = environment.loginUrl;

  registerUser(newUser: Partial<IUser>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerUserUrl, newUser).pipe(
      catchError(this.handleError)
    );
  }

  registerProfessionista(newProfessionista: Partial<IProfessionista>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerProfessionistaUrl, newProfessionista).pipe(
      catchError(this.handleError)
    );
  }

  login(loginData: ILoginData): Observable<AccessData> {
    return this.http.post<AccessData>(this.loginUrl, loginData).pipe(
      tap(data => {
        let token: string | undefined;
        let user: IUser | IProfessionista | null = null;

        if (data.userResponse) {
          token = data.userResponse.token;
          user = data.userResponse.user;
        } else if (data.professionistaResponse) {
          token = data.professionistaResponse.token;
          user = data.professionistaResponse.user;
        }

        if (token && user) {
          this.authSubject.next(user);
          localStorage.setItem('accessData', JSON.stringify(data));
          this.autoLogout(token);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check the entered data.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please check your credentials.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Not found. The resource could not be found.';
          break;
        default:
          errorMessage = `Server error: ${error.message}`;
          break;
      }
    }
    return throwError(errorMessage);
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string {
    const userJson = localStorage.getItem('accessData');
    if (!userJson) return '';

    const accessData: AccessData = JSON.parse(userJson);
    let token: string | undefined;

    if (accessData.userResponse && accessData.userResponse.token) {
      token = accessData.userResponse.token;
    }

    if (accessData.professionistaResponse && accessData.professionistaResponse.token) {
      token = accessData.professionistaResponse.token;
    }

    if (!token || this.jwtHelper.isTokenExpired(token)) return '';

    return token;
  }

  autoLogout(jwt: string) {
    const expDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date;
    const expMs = expDate.getTime() - new Date().getTime();

    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    const userJson = localStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: AccessData = JSON.parse(userJson);
    let token: string | undefined;
    let user: IUser | IProfessionista | null = null;

    if (accessData.userResponse) {
      token = accessData.userResponse.token;
      user = accessData.userResponse.user;
    }

    if (accessData.professionistaResponse) {
      token = accessData.professionistaResponse.token;
      user = accessData.professionistaResponse.user;
    }

    if (!token || this.jwtHelper.isTokenExpired(token)) return;

    this.authSubject.next(user);
    this.autoLogout(token);
  }

  errors(err: any) {
    switch (err.error) {
      case 'Email and Password are required':
        return new Error('Email e password obbligatorie');
      case 'Email already exists':
        return new Error('Utente esistente');
      case 'Email format is invalid':
        return new Error('Email scritta male');
      case 'Cannot find user':
        return new Error('Utente inesistente');
      default:
        return new Error('Errore');
    }
  }


}
