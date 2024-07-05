import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProfessionista } from '../Models/iprofessionista';

@Injectable({
  providedIn: 'root'
})
export class ProfessionistiService {
  private apiUrl = `${environment.registerProfessionistaUrl}`;

  constructor(private http: HttpClient) { }


  getProfessionisti(): Observable<IProfessionista[]> {
    return this.http.get<IProfessionista[]>(`${this.apiUrl}/all`);
  }

  getProfessionistaById(id: number): Observable<IProfessionista> {
    return this.http.get<IProfessionista>(`${this.apiUrl}/${id}`);
  }


  updateProfessionista(id: number, professionista: Partial<IProfessionista>): Observable<IProfessionista> {
    return this.http.put<IProfessionista>(`${this.apiUrl}/${id}`, professionista);
  }

  deleteProfessionista(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }


  uploadAvatar(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/${id}/avatar`, formData).pipe(
      map(response => response.url)
    );
  }

  getAvatarUrl(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/avatar`);
  }

  deleteAvatar(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}/avatar`);
  }

  updateAvatar(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<string>(`${this.apiUrl}/${id}/avatar`, formData);
  }
}
