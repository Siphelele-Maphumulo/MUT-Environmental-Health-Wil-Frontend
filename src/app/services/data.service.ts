import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentRequest {
  studentNumberId: number;
  firstName: string;
  lastName: string;
  title: string;
  race: string;
  initials: string;
  dateOfBirth: Date;
  enrollmentYear: number;
  levelOfStudy: string;
  qualification: string;
  studentEmail: string;
  hashedPassword: string;
  phoneNumber: string;
  altPhoneNumber: string;
  status: string;
  idNumber: string;
  gender: string;
  cvDocument: Uint8Array;
  idDocument: Uint8Array;
  provinceOfResidence: string;
  physicalAddress: string;
  homeTown: string;
  signature: Uint8Array;
  dateAccountCreated: Date;
}

export interface WILPlacementRequest {
  placementId: number;
  studentId: number;
  organisationId: number;
  mentorId: number;
  startDate: Date;
  endDate: Date;
  placementStatus: string;
  placementType: string;
  isInformationCorrect: boolean;
  isWilPreferredAreaCommunicated: boolean;
  noReasonWilAttendancePrevented: boolean;
  declarationDate: Date;
}

export interface LogSheetRequest {
  logDate: string;
  studentNumber: string;
  activity1: string;
  activity2: string;
  activity3: string;
  activity4: string;
  activity5: string;
  activity6: string;
  activity7: string;
  activity8: string;
  activity9: string;
  activity10: string;
  activity11: string;
  activity12: string;
  activity13: string;
  activity14: string;
  hours1: number;
  hours2: number;
  hours3: number;
  hours4: number;
  hours5: number;
  hours6: number;
  hours7: number;
  hours8: number;
  hours9: number;
  hours10: number;
  hours11: number;
  hours12: number;
  hours13: number;
  hours14: number;
  situationInterpretation: string;
  situationEvaluation: string;
  situationDescription: string;
  situationReflection: string;
}

export interface AuthResponse {
  message: string;
  token?: string; // Optional JWT token for authentication
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private WILApplicationBaseUrl = 'http://localhost:8081/api/wil-placement-applications';
  private StudentBaseUrl = 'http://localhost:8081/api/students';
  private LogsheetBaseUrl = 'http://localhost:8081/api/logsheets';

  constructor(private http: HttpClient) {}

  createStudent(studentData: StudentRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.StudentBaseUrl}/createStudent`, studentData);
  }

  createPlacementApplication(placementData: WILPlacementRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.WILApplicationBaseUrl}/createPlacementApplication`, placementData);
  }

  createLogSheet(logsheetData: LogSheetRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.LogsheetBaseUrl}/createLogSheet`, logsheetData);
  }

  getAllLogSheets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.LogsheetBaseUrl}`);
  }

  // New method to retrieve all applications
  getAllApplications(): Observable<StudentRequest[]> {
    return this.http.get<StudentRequest[]>(`${this.WILApplicationBaseUrl}/applications`);
  }
}
