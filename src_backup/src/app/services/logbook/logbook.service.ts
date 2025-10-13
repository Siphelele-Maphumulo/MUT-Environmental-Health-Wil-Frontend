import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Fetch all logsheets for a student
  getLogbook(studentNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-logsheet/${studentNumber}`);
  }

  // Optional: Sign a logsheet by ID
  signLogSheet(logsheetId: number, formData: FormData): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/sign-logsheets/${logsheetId}`,
      formData,
      {
        headers: {
          // Do not set Content-Type manually when using FormData
          // It will be handled automatically
        },
      }
    );
  }

  // Optional: Update a logsheet
  updateLogSheet(logsheetId: number, formData: FormData): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update-logsheets/${logsheetId}`,
      formData
    );
  }

  // Optional: Delete a logsheet
  deleteLogSheet(logsheetId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-logsheets/${logsheetId}`);
  }
}
