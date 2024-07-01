import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.registerUserUrl; // Assumendo che il backend sia in esecuzione su localhost:8080

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, userData);
  }

  deleteUserProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profile`);
  }

  uploadProfileImage(imageData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, imageData);
  }
}
