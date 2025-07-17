import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface StudentAttendance {
  id: number;
  first_names: string;
  surname: string;
  initials: string;
  student_number: string;
  attended: boolean;
  signature_image: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceServiceService {
  private apiUrl = 'http://localhost:3000/api'; // Make sure this matches your backend's base URL

  constructor(private http: HttpClient) { }

  // ✅ Get upcoming events with active registers
  getUpcomingEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/upcoming-events`).pipe(catchError(this.handleError));
  }

  // ✅ Get list of eligible students
  getEligibleStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/eligible-students`).pipe(catchError(this.handleError));
  }

  // ✅ Get attendance register for a specific event
  getAttendanceRegister(eventId: number): Observable<{ success: boolean; eventDate: string; data: StudentAttendance[] }> {
    return this.http.get<{ success: boolean; eventDate: string; data: StudentAttendance[] }>(
      `${this.apiUrl}/event-attendance/register/${eventId}`
    ).pipe(catchError(this.handleError));
  }

  // ✅ Mark attendance for a student
  markAttendance(eventId: number, studentId: number, attended: boolean): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/event-attendance/mark`,
      { event_id: eventId, student_id: studentId, attended }
    ).pipe(catchError(this.handleError));
  }

  // ✅ Get full attendance list for reporting/admin view
  getAttendanceList(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/event-attendance/${eventId}`).pipe(catchError(this.handleError));
  }

  // ✅ Register for a lecture
registerForLecture(eventId: number, studentId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/lectures/register`, { 
    event_id: eventId, 
    student_id: studentId 
  }).pipe(
    catchError(this.handleError)
  );
}

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    let errorMessage = 'An error occurred';
    if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please check your connection.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}