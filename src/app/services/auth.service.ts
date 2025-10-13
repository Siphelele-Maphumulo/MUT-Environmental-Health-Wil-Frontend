import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

// Interface definitions
interface StatusUpdateResponse {
  emailError: any;
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
  public apiUrl = 'http://localhost:8080/api';
  private tokenKey = 'authToken';
  private userEmailKey = 'userEmail';
  private userRoleKey = 'userRole';
  private studentNumberKey = 'studentNumber';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  // Don't initialize storage here - wait for constructor
  private isBrowser: boolean;
  private storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.storage = this.isBrowser ? sessionStorage : null;
  }

  // ========== STORAGE METHODS ==========

  // Safe storage methods that check platform
  private setItem(key: string, value: string): void {
    if (this.isBrowser && this.storage) {
      this.storage.setItem(key, value);
    }
  }

  private getItem(key: string): string | null {
    if (this.isBrowser && this.storage) {
      return this.storage.getItem(key);
    }
    return null;
  }

  private removeItem(key: string): void {
    if (this.isBrowser && this.storage) {
      this.storage.removeItem(key);
    }
  }

  private clearStorage(): void {
    if (this.isBrowser && this.storage) {
      this.storage.clear();
    }
  }

  // ========== PUBLIC API METHODS ==========

  getApiUrl(): string {
    return this.apiUrl;
  }

  // Get authentication headers with JWT token
  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Get current supervisor info with JWT token
  getCurrentSupervisor(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/current-supervisor`, { headers });
  }

  // Submit declaration with auth
  submitDeclaration(formData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/submit-declaration-letter`, formData, { headers });
  }

  // Submit declaration - Development version (no authentication)
  submitDeclarationDev(formData: any): Observable<any> {
    // Add the supervisor email to the form data
    const userEmail = this.getCurrentUserEmail();
    const submissionData = {
      ...formData,
      supervisorEmail: userEmail
    };

    console.log('🔍 DEV: Submitting declaration for:', userEmail);
    
    return this.http.post(`${this.apiUrl}/submit-declaration-letter-dev`, submissionData);
  }

  // ========== AUTHENTICATION METHODS ==========

  // Store authentication data consistently
  private storeAuthData(token: string, email: string, role: string, studentNumber?: string): void {
    this.setItem(this.tokenKey, token);
    this.setItem(this.userEmailKey, email);
    this.setItem(this.userRoleKey, role);
    
    if (studentNumber) {
      this.setItem(this.studentNumberKey, studentNumber);
    }
    
    console.log('📦 Stored auth data:');
    console.log('- Token:', token);
    console.log('- Email:', email);
    console.log('- Role:', role);
    console.log('- Student Number:', studentNumber || 'N/A');
  }

  // Get token from storage
  getToken(): string | null {
    return this.getItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const userEmail = this.getUserEmail();
    
    console.log('🔐 Auth Service - Checking authentication:');
    console.log('- Token exists:', !!token);
    console.log('- User email exists:', !!userEmail);
    
    return !!(token && userEmail);
  }

  // Get current user email
  getCurrentUserEmail(): string | null {
    return this.getItem(this.userEmailKey);
  }

  // Get current user role
  getCurrentUserRole(): string | null {
    return this.getItem(this.userRoleKey);
  }

  // Get student number
  getStudentNumber(): string | null {
    return this.getItem(this.studentNumberKey);
  }

  // Logout
  logout(): void {
    this.removeItem(this.tokenKey);
    this.removeItem(this.userEmailKey);
    this.removeItem(this.userRoleKey);
    this.removeItem(this.studentNumberKey);
    console.log('🔐 User logged out');
    this.router.navigate(['/home']);
  }

  // ========== LOGIN METHODS ==========

  // Student login
  studentLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/studentLogin`, credentials, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response: any) => {
          console.log('🔐 Student Login Response:', response);
          
          if (response.success && response.token) {
            const studentNumber = response.user?.student_number || response.student_number || this.extractStudentNumberFromEmail(response.user?.email || response.email);
            
            this.storeAuthData(
              response.token,
              response.user?.email || response.email,
              response.user?.userRole || response.userRole,
              studentNumber
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // Staff login
  staffLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/staffLogin`, credentials, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
      })
      .pipe(
        tap((response: any) => {
          console.log('🔐 Staff Login Response:', response);
          
          if (response.success && response.token) {
            this.storeAuthData(
              response.token,
              response.user?.email || response.email,
              response.user?.userRole || response.userRole
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // Mentor login
  mentorLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/mentorLogin`, credentials, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
      })
      .pipe(
        tap((response: any) => {
          console.log('🔐 Mentor Login Response:', response);
          
          if (response.success && response.token) {
            this.storeAuthData(
              response.token,
              response.user?.email || response.email,
              response.user?.userRole || response.userRole
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // HPCSA login
  hpcsaLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/hpcsa/login`, { email, password })
      .pipe(
        tap((response: any) => {
          console.log('🔐 HPCSA Login Response:', response);
          
          if (response.success && response.token) {
            this.storeAuthData(
              response.token,
              response.user?.email || response.email,
              response.user?.userRole || response.userRole
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // ========== SIGNUP METHODS ==========

  // Student signup
  studentSignup(userData: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/student_signup`, userData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError(this.handleError));
  }

  // Staff signup
  staffSignup(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff_signup`, formData);
  }

  // Mentor signup
  mentorSignup(userData: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/mentor_Signup`, userData, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
      })
      .pipe(catchError(this.handleError));
  }

  // HPCSA signup
  hpcsaSignup(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/hpcsa/signup`, formData)
      .pipe(catchError(this.handleError));
  }

  // All users
  signup(userData: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/signup`, userData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // ========== UTILITY METHODS ==========

  // Enhanced error handler
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

    console.error('API Error:', JSON.stringify(errorContext, null, 2));
    return throwError(() => ({
      message: errorMessage,
      details: errorContext,
    }));
  }

  // Extract student number from email
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

  // Debug authentication state
  debugAuthState(): void {
    console.log('🔐 DEBUG Authentication State:');
    console.log('- Token:', this.getToken());
    console.log('- User Email:', this.getCurrentUserEmail());
    console.log('- User Role:', this.getCurrentUserRole());
    console.log('- Is Authenticated:', this.isAuthenticated());
    
    if (this.isBrowser) {
      console.log('- Session Storage:', {
        token: sessionStorage.getItem('authToken'),
        email: sessionStorage.getItem('userEmail'),
        role: sessionStorage.getItem('userRole')
      });
    } else {
      console.log('- Session Storage: Not available (server-side)');
    }
  }

  // Get current supervisor info by email
  getCurrentSupervisorByEmail(): Observable<any> {
    const userEmail = this.getCurrentUserEmail();
    
    if (!userEmail) {
      console.error('❌ No user email found in storage');
      return throwError(() => new Error('No user email found. Please log in again.'));
    }

    console.log('🔍 Getting supervisor by email:', userEmail);
    
    // Use the new endpoint that doesn't require token
    return this.http.get(`${this.apiUrl}/current-supervisor-by-email?email=${encodeURIComponent(userEmail)}`).pipe(
      tap(response => {
        console.log('✅ Current supervisor response:', response);
      }),
      catchError(error => {
        console.error('❌ Current supervisor error:', error);
        return throwError(() => error);
      })
    );
  }

  // Utility methods to get stored user data (consistent naming)
  getUserEmail(): string | null {
    return this.getCurrentUserEmail();
  }

  getUserRole(): string | null {
    return this.getCurrentUserRole();
  }

  // ========== OTHER METHODS ==========

  // Application methods
  submitStudentApplication(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/applications`, formData)
      .pipe(catchError(this.handleError));
  }

  // Update WIL application status with auth headers
  updateWilApplicationStatus(applicationId: number, newStatus: 'Pending' | 'Accepted' | 'Rejected') {
    const headers = this.getAuthHeaders();
    
    return this.http.put(
      `${this.apiUrl}/update-status/${applicationId}`,
      { status: newStatus },
      { 
        headers,
        observe: 'response'
      }
    ).pipe(
      map(response => {
        console.log('Update status response:', response);
        return response.body as StatusUpdateResponse;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Status update HTTP error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });

        let errorMessage = 'Failed to update application status';
        let errorDetails: any = { 
          success: false, 
          message: errorMessage,
          status: error.status
        };

        if (error.status === 0) {
          errorDetails.message = 'Unable to connect to server. Please check your connection.';
        } else if (error.status === 400) {
          errorDetails.message = error.error?.message || 'Invalid request data';
        } else if (error.status === 404) {
          errorDetails.message = error.error?.message || 'Application not found';
        } else if (error.status === 500) {
          errorDetails.message = error.error?.message || 'Server error occurred';
        } else if (error.error && typeof error.error === 'object') {
          errorDetails = { ...error.error, status: error.status };
        }

        return throwError(() => errorDetails);
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

// In auth.service.ts - Update method to accept either object or FormData
signLogsheet(logsheetId: number, data: { ehp_hi_number: string } | FormData): Observable<any> {
  if (!logsheetId) {
    return throwError(() => new Error('Missing logsheet ID'));
  }

  // Get authentication headers
  let headers = this.getAuthHeaders();
  
  // If it's FormData, don't set Content-Type (let browser set it with boundary)
  if (data instanceof FormData) {
    headers = headers.delete('Content-Type');
  }

  console.log('🔐 Sign Logsheet Debug:');
  console.log('- Logsheet ID:', logsheetId);
  console.log('- Data:', data);
  console.log('- Headers:', headers);

  return this.http.put(
    `${this.apiUrl}/sign-logsheets/${logsheetId}`,
    data,
    { headers }
  ).pipe(
    tap(response => {
      console.log('✅ Sign logsheet successful:', response);
    }),
    catchError((error) => {
      console.error('❌ Signing error:', error);
      return throwError(() => error);
    })
  );
}

  deleteLogSheet(id: number): Observable<any> {
    // Validate ID before making the request
    if (!id || id <= 0) {
      console.error('Invalid logsheet ID:', id);
      return throwError(() => new Error('Invalid logsheet ID'));
    }
  
    console.log('Deleting logsheet with ID:', id);
  
    return this.http.delete<any>(`${this.apiUrl}/delete-logsheets/${id}`, {
      observe: 'response'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update staff position with auth headers
  updateStaffPosition(staffId: number, position: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/staff/${staffId}/position`, { position }, { headers });
  }

  // Delete staff with auth headers
  deleteStaff(staffId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/staff/${staffId}`, { headers });
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
  if (!code || code.trim() === '') {
    return throwError(() => new Error('Event code is required'));
  }

  const headers = this.getAuthHeaders();
  
  console.log('🔐 Validating event code:', code);

  return this.http.post(
    `${this.apiUrl}/validate-event-code`,
    { code: code.toUpperCase().trim() },
    { headers }
  ).pipe(
    tap(response => {
      console.log('✅ Event code validation successful:', response);
    }),
    catchError((error) => {
      console.error('❌ Event code validation error:', error);
      return throwError(() => error);
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

  // Get guest lectures with auth headers if needed
  getGuestLectures(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/upcoming-events`, { headers }).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => new Error('Failed to fetch guest events'));
      })
    );
  }

  // Delete guest lecture with auth headers
  deleteGuestLecture(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/delete-event/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => new Error('Failed to delete guest event'));
      })
    );
  }

  // Check supervisor signature with auth headers
  checkSupervisorSignature(supervisorName: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/check-supervisor-signature/${encodeURIComponent(supervisorName)}`, { headers });
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

// In your auth.service.ts or attendance.service.ts
getCurrentStudentDetails(studentNumber: string): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/students/current?studentNumber=${studentNumber}`
  );
}

getEventAttendance(eventId: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/attendance-registers/${eventId}`
  );
}

  // Add to auth.service.ts
  checkWilApplicationSignature(studentNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/check-wil-signature/${studentNumber}`);
  }

  getStudentNameByNumber(studentNumber: string): Observable<any> {
    console.log(`🔍 AuthService: Fetching student name for ${studentNumber}`);
    
    return this.http.get<any>(`${this.apiUrl}/student/${studentNumber}`).pipe(
      tap(response => {
        console.log('✅ AuthService: Student data received', response);
      }),
      catchError(error => {
        console.error('❌ AuthService: Error fetching student', error);
        return throwError(() => error);
      })
    );
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

  // Add this method to your auth.service.ts
  // In your auth.service.ts
  deletePlacement(id: number | string): Observable<any> {
    if (!id) {
      console.error('Cannot delete placement: ID is undefined or null');
      return throwError(() => new Error('Placement ID is required'));
    }
    return this.http.delete(`${this.apiUrl}/placements/${id}`);
  }

  // Make sure you have this method for viewing placements
  getPlacementById(id: number | string): Observable<any> {
    if (!id) {
      console.error('Cannot get placement: ID is undefined or null');
      return throwError(() => new Error('Placement ID is required'));
    }
    return this.http.get(`${this.apiUrl}/placements/${id}`);
  }

  // Fix the deleteReflection method (you had placements URL instead of reflections)
  deleteReflection(id: number): Observable<any> {
    if (!id) {
      console.error('Cannot delete reflection: ID is undefined or null');
      return throwError(() => new Error('Reflection ID is required'));
    }
    return this.http.delete(`${this.apiUrl}/reflections/${id}`); // Fixed URL
  }

  getAllPlacements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/placements`).pipe(
      catchError((error) => {
        console.error('Error fetching placements:', error);
        return throwError(() => new Error('Failed to fetch Placements'));
      })
    );
  }

  updateHpcsaReport(studentNumber: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/update-hpcsa-report/${studentNumber}`,
      {}
    );
  }

  updateStudentStatus(studentNumber: string): Observable<any> {
    const url = `${this.apiUrl}/update-student-status/${studentNumber}`;
    console.log('Calling updateStudentStatus URL:', url);
  
    return this.http.post(url, {}, {  // Empty object as body since we're using URL parameter
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

  // In logbook.service.ts or auth.service.ts
getStudentLevel(studentNumber: string): Observable<any> {
  return this.http.get(`http://localhost:8080/api/student-level/${studentNumber}`);
}

  getCurrentUserId(): number | null {
    if (!this.isBrowser) return null;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.id ? user.id : null;
  }

  getAttendanceRegisters(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/attendance-registers`)
      .pipe(catchError(this.handleError));
  }

  getEventAttendanceDetails(eventId: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/event-attendance/${eventId}`)
      .pipe(catchError(this.handleError));
  }

markAttendance(attendanceId: number, attended: boolean) {
  const url = `${this.apiUrl}/attendance/mark`;
  const body = {
    attendance_id: attendanceId, // Now sending numeric ID
    attended: attended
  };
  
  console.log('📝 Marking attendance with numeric ID:', body);
  return this.http.post<any>(url, body);
}

deleteEvent(eventId: number) {
  const url = `${this.apiUrl}/delete-event/${eventId}`;
  
  console.log('🗑️ Deleting event with ID:', eventId);
  return this.http.delete<any>(url);
}

  getStudentNumberFromSession(): string | null {
    const email = this.getItem('userEmail');
    if (!email) return null;

    const parts = email.split('@');
    if (parts.length < 2 || !parts[0]) return null;

    return parts[0].trim();
  }

  /**
   * Method to register for a lecture
   * @param eventId The ID of the event to register for
   * @param studentId The ID of the student registering
   * @returns An observable of the response
   */
  // Register for lecture with auth headers
  registerForLecture(eventId: number, studentId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/lectures/register`, {
      event_id: eventId,
      student_id: studentId,
    }, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}