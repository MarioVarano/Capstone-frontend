import { Injectable } from '@angular/core';
import { IUserResponse } from '../Models/iUser-response';
import { IProfessionista } from '../Models/iprofessionista';
import { ILoginData } from '../Models/i-login-data';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  jwtHelper: JwtHelperService = new JwtHelperService(); //ci permette di lavorare facilmente con i jwt

  authSubject = new BehaviorSubject<IUser | IProfessionista | null>(null); // può essere null, utente o barman

  user$ = this.authSubject.asObservable(); // contiene i dati dell'utente loggato oppure null
  isLoggedIn$ = this.user$.pipe(
    map(user => !!user),
    tap(user => this.syncIsLoggedIn = user)
  ); // restituisce true se l'utente è loggato, false se non lo è

  syncIsLoggedIn: boolean = false;

  constructor(
    private http: HttpClient, // per le chiamate http
    private router: Router // per i redirect
  ) {
    this.restoreUser(); // come prima cosa controllo se è già attiva una sessione, e la ripristino
  }

  //ng g environments
  registerUserUrl: string = environment.registerUserUrl;
  registerProfessionistaUrl: string = environment.registerProfessionistaUrl;
  loginUrl: string = environment.loginUrl;

  registerUser(newUser: Partial<IUser>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerUserUrl, newUser);
  }

  registerProfessionista(newProfessionista: Partial<IProfessionista>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerProfessionistaUrl, newProfessionista);
  }

  login(loginData: ILoginData): Observable<AccessData> {
    return this.http.post<AccessData>(this.loginUrl, loginData)
      .pipe(tap(data => {
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
          this.authSubject.next(user); //comunico al subject che l'utente si è loggato
          localStorage.setItem('accessData', JSON.stringify(data));
          this.autoLogout(token); // riavvia il timer per la scadenza della sessione
        }
      }));
  }

  logout() {
    this.authSubject.next(null); //comunico al subject che l'utente si è sloggato
    localStorage.removeItem('accessData'); //cancello i dati dell'utente
    this.router.navigate(['/auth/login']); //mando via l'utente loggato
  }

  getAccessToken(): string {
    const userJson = localStorage.getItem('accessData'); //recupero i dati di accesso
    if (!userJson) return ''; //se l'utente non si è mai loggato blocca tutto

    const accessData: AccessData = JSON.parse(userJson); //se viene eseguita questa riga significa che i dati ci sono, quindi la converto da json ad oggetto per permetterne la manipolazione

    let token: string | undefined;

    // Controlla se il token è presente in userResponse
    if (accessData.userResponse && accessData.userResponse.token) {
      token = accessData.userResponse.token;
    }

    // Controlla se il token è presente in barmanResponse
    if (accessData.professionistaResponse && accessData.professionistaResponse.token) {
      token = accessData.professionistaResponse.token;
    }

    // Se non esiste un token valido, ritorna una stringa vuota
    if (!token) return '';

    // ora controllo se il token è scaduto, se lo è fermiamo la funzione
    if (this.jwtHelper.isTokenExpired(token)) return '';

    return token; //ritorna il token
  }

  autoLogout(jwt: string) {
    const expDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date; //trovo la data di scadenza del token
    const expMs = expDate.getTime() - new Date().getTime(); //sottraggo i ms della data/ora di oggi da quella nel jwt

    //avvio un timer, quando sarà passato il numero di ms necessari per la scadenza del token, avverrà il logout
    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    const userJson = localStorage.getItem('accessData'); //recupero i dati di accesso
    if (!userJson) return; //se l'utente non si è mai loggato blocca tutto

    const accessData: AccessData = JSON.parse(userJson); //se viene eseguita questa riga significa che i dati ci sono, quindi la converto da json ad oggetto per permetterne la manipolazione

    let token: string | undefined;
    let user: IUser | IProfessionista | null = null;

    // Controlla se il token e l'utente sono presenti in userResponse
    if (accessData.userResponse) {
      token = accessData.userResponse.token;
      user = accessData.userResponse.user;
    }

    // Controlla se il token e l'utente sono presenti in barmanResponse
    if (accessData.professionistaResponse) {
      token = accessData.professionistaResponse.token;
      user = accessData.professionistaResponse.user;
    }

    // Se non esiste un token valido, ferma la funzione
    if (!token || this.jwtHelper.isTokenExpired(token)) return;

    //se nessun return viene eseguito proseguo
    this.authSubject.next(user); //invio I dati dell'utente al behaviorsubject
    this.autoLogout(token); //riavvio il timer per la scadenza della sessione
  }

  errors(err: any) {
    switch (err.error) {
      case "Email and Password are required":
        return new Error('Email e password obbligatorie');
      case "Email already exists":
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
