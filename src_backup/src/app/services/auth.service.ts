import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Interface definitions for better type safety
interface StatusUpdateResponse {
  success: boolean;
  message: string;
  newStatus: string;
  code?: string;
  changes?: number;
}

interface LogSheet {
  message: string;
  data: {
    log_date: string;
    student_number: string;
    activities: Activity[];
  };
}

interface Activity {
  activity: string;
  hours: number;
}

export interface User {
  email: string;
  title: string;
  password: string;
  code: string;
}

interface StaffCodeResponse {
  success: boolean;
  message: string;
  data: {
    code: string;
  };
}

export interface StudentUser {
  email: string;
  title: string;
  password: string;
  code: string;
}

export interface MentorUser {
  email: string;
  title: string;
  password: string;
  code: string;
}

interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  updatedFields?: string[];
}

export interface StudentReflection {
  level_of_study: string;
  created_at: string | number | Date;
  id: number;
  student_number: string;
  student_name: string;
  feeling: string;
  success: string;
  challenges: string;
  perspective_change: string;
  suggestions: string;
}

export interface StudentPlacement {
  student_number: string;
  student_name: string;
  supervisor: string;
  municipality: string;
  email: string;
  cell_number: string;
  hospital: string;
  abattoir: string;
  created_at: string;
}

export interface StudentAttendance {
  id: number;
  surname: string;
  initials: string;
  first_names: string;
  student_number: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'http://localhost:8080/api'; // Base URL for the API
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Enhanced error handler with detailed logging
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    const errorContext = {
      status: error.status,
      url: error.url,
      message: error.message,
      serverMessage: error.error?.message,
    };

    if (error.status === 0) {
      errorMessage = 'Network error: Could not connect to server';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message;
    }

    console.error('API Error:', errorContext);
    return throwError(() => ({
      message: errorMessage,
      details: errorContext,
    }));
  }

  // Student users
  studentSignup(userData: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/student_signup`, userData, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  // Staff users
  staffSignup(userData: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/staff_Signup`, userData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Mentor users
  mentorSignup(userData: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/mentor_Signup`, userData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // All users
  signup(userData: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/signup`, userData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Student login
  studentLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/studentLogin`, credentials, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  // Staff login
  staffLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/staffLogin`, credentials, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Mentor login
  mentorLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/mentorLogin`, credentials, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }


hpcsaSignup(formData: FormData): Observable<any> {
  return this.http
    .post(`${this.apiUrl}/hpcsa/signup`, formData)
    .pipe(catchError(this.handleError));
}



// HPCSA Login
hpcsaLogin(email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/hpcsa/login`, { email, password }).pipe(
    tap((response: any) => {
      if (isPlatformBrowser(this.platformId) && response.email) {
        sessionStorage.setItem('userEmail', response.email);
      }
    }),
    catchError(this.handleError)
  );
}

  // Get logged-in user
  getLoggedInUser(): any {
    return JSON.parse(localStorage.getItem('loggedInUser') || 'null');
  }

  // Logout
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
      localStorage.clear();
    }
    this.router.navigate(['/home']);
  }

  // Application methods
  submitStudentApplication(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/applications`, formData)
      .pipe(catchError(this.handleError));
  }

  updateWilApplicationStatus(
    applicationId: number,
    status: 'Pending' | 'Accepted' | 'Rejected'
  ): Observable<StatusUpdateResponse> {
    return this.http
      .put<StatusUpdateResponse>(
        `${this.apiUrl}/update-status/${applicationId}`,
        { status },
        { headers: this.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Status update error:', {
            applicationId,
            status,
            statusCode: error.status,
            error: error.error,
          });

          let userMessage = 'Failed to update status';
          if (error.status === 500) {
            userMessage = error.error?.message || 'Server error occurred';
            if (error.error?.errorDetails?.sqlMessage) {
              console.error(
                'MySQL Error:',
                error.error.errorDetails.sqlMessage
              );
            }
          }

          return throwError(() => ({
            message: userMessage,
            details: error.error?.errorDetails,
            statusCode: error.status,
          }));
        })
      );
  }

  // Logsheet methods
  getLogsheets(): Observable<LogSheet[]> {
    return this.http
      .get<LogSheet[]>(`${this.apiUrl}/daily-logsheets`)
      .pipe(catchError(this.handleError));
  }

  getLogsheet(logId: number): Observable<LogSheet> {
    return this.http
      .get<LogSheet>(`${this.apiUrl}/daily-logsheets/${logId}`)
      .pipe(catchError(this.handleError));
  }

  checkLogsheetExists(
    studentNumber: string,
    logDate: string
  ): Observable<{ exists: boolean }> {
    if (!studentNumber || !logDate) {
      return throwError(() => new Error('Student number and log date are required'));
    }

    return this.http
      .get<{ exists: boolean }>(
        `${this.apiUrl}/check-logsheet/${studentNumber}/${logDate}`,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          responseType: 'json' as const,
        }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            return throwError(() => new Error('Endpoint not found. Check backend routes.'));
          }
          return throwError(() => error);
        })
      );
  }

  createLogSheet(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/submit-logsheet`, formData)
      .pipe(catchError(this.handleError));
  }

  updateLogsheet(logsheetId: number, formData: FormData): Observable<LogSheet> {
    return this.http
      .put<LogSheet>(
        `${this.apiUrl}/update-logsheets/${logsheetId}`,
        formData,
        {
          observe: 'response',
        }
      )
      .pipe(
        map((response) => {
          if (!response.body) {
            throw new Error('Empty response body');
          }
          return response.body;
        }),
        catchError(this.handleError)
      );
  }

  signLogsheet(logsheetId: number, formData: FormData): Observable<any> {
    if (!logsheetId && !formData.get('id')) {
      return throwError(() => new Error('Missing logsheet ID'));
    }

    return this.http
      .put(
        `${this.apiUrl}/sign-logsheets/${logsheetId || formData.get('id')}`,
        formData,
        {
          headers: { Accept: 'application/json' },
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Signing error:', error);
          return throwError(() => error);
        })
      );
  }

  deleteLogSheet(id: number): Observable<HttpResponse<void>> {
    return this.http
      .delete<void>(`${this.apiUrl}/delete-logsheets/${id}`, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Utility methods
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem('userEmail');
    }
    return false;
  }

  getUserEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('userEmail');
    }
    return null;
  }

  getStudentNumber(): string | null {
    const email = this.getUserEmail();
    return email ? email.split('@')[0] : null;
  }

  validateSignupCode(code: string) {
    this.snackBar.open('The code on Auth!' + code, 'Close', {
      duration: 5000,
    });

    return this.http.post(`${this.apiUrl}/validate-signup-code`, { code }).pipe(
      map((response: any) => {
        if (response && typeof response.success === 'boolean') {
          return response.success;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Validation error:', error);
        return throwError(() => new Error('Validation failed'));
      })
    );
  }

  blockSignupEmail(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post(`${this.apiUrl}/block-signup-email`, { email }).pipe(
      map((response: any) => ({
        success: response?.success || false,
        message: response?.message || '',
      })),
      catchError((error) => {
        console.error('Error blocking email:', error);
        return throwError(() => new Error('Failed to block email'));
      })
    );
  }

  createEventCode(eventCodeData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/create-event-code`, eventCodeData)
      .pipe(
        catchError((error) => {
          console.error('API error:', error);
          return throwError(() => new Error('Event code creation failed'));
        })
      );
  }

  validateEventCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-event-code`, { code }).pipe(
      catchError((error) => {
        console.error('Validation error:', error);
        return throwError(() => new Error('Validation failed'));
      })
    );
  }

  addGuestLecture(lectureData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/guest-lectures`, lectureData).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => new Error('Submission failed'));
      })
    );
  }

  getGuestLectures(): Observable<any> {
    return this.http.get(`${this.apiUrl}/upcoming-events`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => new Error('Failed to fetch guest events'));
      })
    );
  }

  deleteGuestLecture(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-event/${id}`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => new Error('Failed to delete guest event'));
      })
    );
  }

  submitDeclaration(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/submit-declaration-letter`, formData)
      .pipe(catchError(this.handleError));
  }

  createStaffCode(staffData: { staff_name: string; staff_email: string }): Observable<StaffCodeResponse> {
    return this.http
      .post<StaffCodeResponse>(`${this.apiUrl}/staff_codes`, staffData, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  validateStaffCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-staff-code`, { code }).pipe(
      map((response: any) => {
        if (response && typeof response.success === 'boolean') {
          return response;
        }
        return { success: false, message: 'Invalid response format' };
      }),
      catchError((error) => {
        console.error('Validation error:', error);
        return throwError(() => new Error('Error validating staff code'));
      })
    );
  }

  getLogsheetByDate(studentNumber: string, logDate: string): Observable<any> {
    const formattedDate = new Date(logDate).toISOString().split('T')[0];
    const url = `${this.apiUrl}/get-logsheet/${studentNumber}/${formattedDate}`;

    console.log('Making request to:', url);

    return this.http.get(url).pipe(catchError(this.handleError));
  }

  update1Logsheet(formData: FormData): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/update-logsheet`, formData)
      .pipe(catchError(this.handleError));
  }

  getSignatureFile(filename: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/signatures/${filename}`, {
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  getProfile(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${email}`).pipe(
      catchError((error) => {
        console.error('Error fetching profile:', error);
        throw error;
      })
    );
  }

  updateProfile(formData: FormData): Observable<any> {
    const email = this.getUserEmail();
    if (!email) {
      return throwError(() => new Error('User email not available'));
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http
      .put(`${this.apiUrl}/profile/${email}`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Profile update error:', error);
          return throwError(() => error);
        })
      );
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    const email = this.getUserEmail();
    if (!email) {
      return throwError(() => new Error('User email not available'));
    }

    return this.http
      .put(
        `${this.apiUrl}/profile/${email}/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: this.headers,
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Password update error:', error);
          return throwError(() => error);
        })
      );
  }

  get currentUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getCurrentStudentDetails(): Observable<{ studentNumber: string }> {
    return this.http.get<{ studentNumber: string }>(
      `${this.apiUrl}/students/current`
    );
  }

  getStudentNameByNumber(studentNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentNumber}`);
  }

  getStudentReflection(studentNumber: string): Observable<StudentReflection> {
  return this.http.get<StudentReflection>(`${this.apiUrl}/reflection/${studentNumber}`);
}


// Get a single reflection by its database ID
getReflectionById(id: number): Observable<StudentReflection> {
  return this.http.get<StudentReflection>(`${this.apiUrl}/reflections/${id}`);
}

// Get the logged-in student's reflection by student number
getStudentReflectionByStudentNumber(studentNumber: string): Observable<StudentReflection> {
  return this.http.get<StudentReflection>(`${this.apiUrl}/reflection/${studentNumber}`);
}

  getAllReflections(): Observable<StudentReflection[]> {
    return this.http.get<StudentReflection[]>(`${this.apiUrl}/reflections`);
  }

  deleteReflection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reflections/${id}`);
  }

  getAllPlacements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/placements`).pipe(
      catchError((error) => {
        console.error('Error fetching placements:', error);
        return throwError(() => new Error('Failed to fetch Placements'));
      })
    );
  }

  deletePlacements(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/placements/${id}`);
  }

  updateHpcsaReport(studentNumber: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/update-hpcsa-report/${studentNumber}`,
      {}
    );
  }

  extractStudentNumberFromEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      console.error('Invalid email provided');
      return '';
    }
    const parts = email.split('@');
    if (parts.length < 2 || !parts[0]) {
      console.warn('Invalid email format:', email);
      return '';
    }
    return parts[0].trim();
  }

  updateStudentStatus(studentNumber: string): Observable<any> {
    const url = `${this.apiUrl}/update-student-status`;
    console.log('Calling updateStudentStatus URL:', url);

    return this.http.post(url, { student_number: studentNumber }, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      responseType: 'json',
    }).pipe(
      catchError((error) => {
        console.error('Full error response:', error);

        let errorMessage = 'Failed to update student status';

        if (error.status === 404) {
          errorMessage = 'API endpoint not found. Check the server URL.';
        } else if (error.error instanceof ProgressEvent) {
          errorMessage = 'Network error - could not connect to server';
        } else if (
          error.error &&
          typeof error.error === 'string' &&
          error.error.startsWith('<!DOCTYPE')
        ) {
          errorMessage = 'Server returned HTML instead of JSON. Check API route.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getCurrentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.id ? user.id : null;
  }

  getAttendanceRegister(eventId: number): Observable<{ success: boolean; eventDate: string; data: StudentAttendance[] }> {
    return this.http.get<{ success: boolean; eventDate: string; data: StudentAttendance[] }>(
      `${this.apiUrl}/event-attendance/register/${eventId}`
    ).pipe(catchError(this.handleError));
  }

  markAttendance(eventId: number, studentId: number, attended: boolean): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/event-attendance/mark`,
      { event_id: eventId, student_id: studentId, attended }
    ).pipe(catchError(this.handleError));
  }

  getStudentNumberFromSession(): string | null {
    const email = sessionStorage.getItem('userEmail');
    if (!email) return null;

    const parts = email.split('@');
    if (parts.length < 2 || !parts[0]) return null;

    return parts[0].trim();
  }

    // Method to register for a lecture
  registerForLecture(eventId: number, studentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/lectures/register`, {
      event_id: eventId,
      student_id: studentId,
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add these methods to your AuthService
getAttendanceRegisters(): Observable<any> {
  return this.http.get(`${this.apiUrl}/attendance-registers`).pipe(
    catchError(this.handleError)
  );
}

getEventAttendanceDetails(eventId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/attendance-registers/${eventId}`).pipe(
    catchError(this.handleError)
  );
}
}