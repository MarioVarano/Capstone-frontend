import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProfessionista } from '../Models/iprofessionista';

@Injectable({
  providedIn: 'root'
})
export class ProfessionistiService {
  private apiUrl = `${environment.registerProfessionistaUrl}`;

  constructor(private http: HttpClient) { }

  getProfessionistaById(id: number): Observable<IProfessionista> {
    return this.http.get<IProfessionista>(`${this.apiUrl}/${id}`);
  }


  updateProfessionista(id: number, professionista: Partial<IProfessionista>): Observable<IProfessionista> {
    return this.http.put<IProfessionista>(`${this.apiUrl}/${id}`, professionista);
  }

  deleteProfessionista(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}
