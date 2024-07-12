import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IAppuntamento } from '../Models/iappuntamento';
import { IGeneralResponse } from '../Models/igeneral-response';
import { IUtenteAppuntamentoDto } from '../Models/i-utente-appuntamento-dto';
import { IAppuntamentoResponse } from '../Models/i-appuntamento-response';
import { IProfessionistaAppuntamentoDto } from '../Models/i-professionista-appuntamento-dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.appuntamentoUrl}`;

  constructor(private http: HttpClient) { }

  getAppointmentById(id: number): Observable<IAppuntamento> {
    return this.http.get<IAppuntamento>(`${this.apiUrl}/${id}`);
  }

  getAllAppointments(): Observable<IAppuntamento[]> {
    return this.http.get<IAppuntamento[]>(this.apiUrl);
  }

  bookAppointment(appointment: IAppuntamento): Observable<IGeneralResponse<IAppuntamento>> {
    return this.http.post<IGeneralResponse<IAppuntamento>>(this.apiUrl, appointment).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.errorMessage || 'Something went wrong';
    }
    return throwError(errorMessage);
  }

 // Service per aggiornare l'appuntamento
 updateAppointment(id: number, appointmentData: Partial<IAppuntamento>): Observable<IGeneralResponse<IAppuntamentoResponse>> {
  return this.http.put<IGeneralResponse<IAppuntamentoResponse>>(`${this.apiUrl}/${id}`, appointmentData).pipe(
    catchError(this.handleError)
  );
}



  deleteAppointment(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`,{responseType: 'text' as 'json' });
  }


  getAppointmentsByUserId(userId: number): Observable<IUtenteAppuntamentoDto[]> {
    return this.http.get<IUtenteAppuntamentoDto[]>(`${this.apiUrl}/utente/${userId}`);
  }

  getAppointmentsByProfessionalId(professionalId: number): Observable<IProfessionistaAppuntamentoDto[]> {
    return this.http.get<IProfessionistaAppuntamentoDto[]>(`${this.apiUrl}/professionista/${professionalId}`);
  }

  confirmAppointment(id: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/confirm/${id}`, null, { responseType: 'text' as 'json' });
}


}
