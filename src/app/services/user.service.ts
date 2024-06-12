import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/users.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private appUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.appUrl = environment.endpoint;
    this.apiUrl = 'api/users';
    }

  getListUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.appUrl}${this.apiUrl}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.appUrl}${this.apiUrl}/${id}`);
  }

  saveUser(user: User): Observable<void> {
    return this.http.post<void>(`${this.appUrl}${this.apiUrl}`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.appUrl}${this.apiUrl}/${user.id}`, user);
  }
}
