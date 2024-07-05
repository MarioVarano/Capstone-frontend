import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IUser } from '../Models/iUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.registerUserUrl}`;

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }


  uploadAvatar(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/${id}/avatar`, formData).pipe(
      map(response => response.url)
    );
  }

  deleteAvatar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}/avatar`, { responseType: 'text' });
  }

  updateAvatar(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${this.apiUrl}/${id}/avatar`, formData, { responseType: 'text' });
  }

  getAvatarUrl(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/avatar`);
  }
}
