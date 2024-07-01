import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { IUser } from '../Models/iUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = environment.registerUserUrl;
  private userSubj = new BehaviorSubject<IUser[]>([]);
  public $users = this.userSubj.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.getAll().subscribe((users) => {
      this.userSubj.next(users);
    });
  }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  getById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.loadUsers())
      );
  }

  updateUser(id: number, user: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${id}`, user)
      .pipe(
        tap(() => this.loadUsers())
      );
  }

  uploadAvatar(username: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/${username}/avatar`, formData)
      .pipe(
        tap(() => this.loadUsers())
      );
  }

  updateAvatar(username: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<string>(`${this.apiUrl}/${username}/avatar`, formData)
      .pipe(
        tap(() => this.loadUsers())
      );
  }

  getUserAvatar(username: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${username}/avatar`);
  }
}
