import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IAppuntamento } from '../Models/iappuntamento';

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

  bookAppointment(appointmentData: Partial<IAppuntamento>): Observable<Partial<IAppuntamento>> {
    return this.http.post<IAppuntamento>(this.apiUrl, appointmentData);
  }

  updateAppointment(id: number, appointmentData: IAppuntamento): Observable<IAppuntamento> {
    return this.http.put<IAppuntamento>(`${this.apiUrl}/${id}`, appointmentData);
  }

  deleteAppointment(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  getAppointmentsByUserId(userId: number): Observable<IAppuntamento[]> {
    return this.http.get<IAppuntamento[]>(`${this.apiUrl}/utente/${userId}`);
  }

  getAppointmentsByProfessionalId(professionalId: number): Observable<IAppuntamento[]> {
    return this.http.get<IAppuntamento[]>(`${this.apiUrl}/professionista/${professionalId}`);
  }

  confirmAppointment(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/confirm/${id}`);
  }
}
