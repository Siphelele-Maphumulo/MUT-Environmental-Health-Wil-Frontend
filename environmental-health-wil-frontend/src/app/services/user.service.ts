import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8081/auth';

  constructor(private http: HttpClient) {}

  // Fetch current user data
  getUserData(): Observable<{ email: string; title: string }> {
    return this.http.get<{ email: string; title: string }>(`${this.baseUrl}/user`);
  }

  // Update user data
  updateUserData(data: { email: string; title: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user`, data);
  }
}
