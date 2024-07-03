import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ILoginData } from '../Models/i-login-data';
import { IUser } from '../Models/iUser';
import { IUserResponse } from '../Models/iUser-response';
import { IProfessionista } from '../Models/iprofessionista';

type AccessData = {
  userResponse?: IUserResponse;
  loginResponseProfession?: IUserResponse;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  jwtHelper: JwtHelperService = new JwtHelperService();
  authSubject = new BehaviorSubject<IUser | IProfessionista | null>(null);
  specializzazione = "";
  isUserProfessionalLoggedIn = false;  // Nuova proprietà
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(
    map((user) => !!user),
    tap((user) => (this.syncIsLoggedIn = !!user))
  );
  syncIsLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  registerUserUrl: string = environment.registerUserUrl;
  registerProfessionistaUrl: string = environment.registerProfessionistaUrl;
  loginUrl: string = environment.loginUrl;

  registerUser(newUser: Partial<IUser>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerUserUrl, newUser).pipe(catchError(this.handleError));
  }

  registerProfessionista(newProfessionista: Partial<IProfessionista>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerProfessionistaUrl, newProfessionista).pipe(catchError(this.handleError));
  }

  login(loginData: ILoginData): Observable<AccessData> {
    return this.http.post<AccessData>(this.loginUrl, loginData).pipe(
      tap((data) => {
        let token: string | undefined;
        let user: IUser | null = null;
        let professionista: IProfessionista | null = null;

        if (data.loginResponseProfession) {
          token = data.loginResponseProfession.token;
          professionista = data.loginResponseProfession.professionista;
          this.specializzazione = data.loginResponseProfession.specializzazione;
          user = professionista;
          this.isUserProfessionalLoggedIn = true;  // Aggiorna proprietà
        } else if (data.userResponse) {
          token = data.userResponse.token;
          user = data.userResponse.user;
          this.specializzazione = data.userResponse.specializzazione;
          this.isUserProfessionalLoggedIn = false;  // Aggiorna proprietà
        }

        if (token && user && this.specializzazione) {
          this.authSubject.next(user);
          localStorage.setItem('accessToken', token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem("specializzazione", this.specializzazione);

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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('specializzazione');
    this.router.navigate(['/']);
  }

  getAccessToken(): string {
    const token = localStorage.getItem('accessToken');
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
    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('accessToken');
    if (!userJson || !token || this.jwtHelper.isTokenExpired(token)) return;

    const user: IUser | IProfessionista = JSON.parse(userJson);
    this.authSubject.next(user);
    this.autoLogout(token);
  }

  getUserName(): string {
    const currentUser = this.authSubject.value;
    if (currentUser) {
      return currentUser.username;
    }
    return '';
  }

  getUserId(): string | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).id : null;
  }

  isUserSimple(): boolean {
    console.log(!!this.authSubject.value, "ciao",  !!this.specializzazione, this.specializzazione);

    return !!this.authSubject.value && this.specializzazione == "UTENTE";

  }

  isUserProfessional(): boolean {
    console.log(!!this.authSubject.value, "ciao2",  !!this.specializzazione);
    return !!this.authSubject.value && this.specializzazione== "PROFESSIONISTA";
  }
}
