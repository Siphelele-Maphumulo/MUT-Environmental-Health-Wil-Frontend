import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Import components
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/shared/home/home.component';
import { LogsheetComponent } from './components/student/logsheet/logsheet.component';
import { ContactComponent } from './components/student/contact/contact.component';
import { GuideComponent } from './components/shared/guide/guide.component';
import { CommunicationComponent } from './components/shared/communication/communication.component';
import { BenefitsComponent } from './components/shared/benefits/benefits.component';
import { ProfileComponent } from './components/student/profile/profile.component';
import { ReflectionsComponent } from './components/student/reflections/reflections.component';
import { LogformComponent } from './components/student/logform/logform.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { PlacementComponent } from './components/admin/placement/placement.component';
import { EventManagementComponent } from './components/admin/event-management/event-management.component';
import { AuditorsComponent } from './components/HPCSA/auditors/auditors.component';
import { ComplianceReportComponent } from './components/HPCSA/compliance-report/compliance-report.component';
import { StudentLogbookViewerComponent } from './components/HPCSA/student-logbook-viewer/student-logbook-viewer.component';
import { MentorGuideComponent } from './components/mentor/mentor-guide/mentor-guide.component';
import { ClassPageComponent } from './components/admin/class-page/class-page.component';

import { MentorLogbooksComponent } from './components/mentor/mentor-logbooks/mentor-logbooks.component';
// import { ApplicationComponent } from './components/student/application/application.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { StudentApplicationComponent } from './components/student/student-application/student-application.component';
import { UpdateStudentComponent } from './components/student/update-student/update-student.component';
import { UpdateStaffComponent } from './components/update-staff/update-staff.component';
import { MentorProfileComponent } from './components/mentor/mentor-profile/mentor-profile.component';
import { DeclarationReportComponent } from './components/mentor/declaration-report/declaration-report.component';
import { PlacementPerformanceComponent } from './components/mentor/placement-performance/placement-performance.component';
import { MentorDashboardComponent } from './components/mentor/mentor-dashboard/mentor-dashboard.component';
import { ApplicationsComponent } from './components/admin/applications/applications.component';
import { PinDialogComponent } from './components/admin/event-management/pin-dialog/pin-dialog.component';
import { GuestComponent } from './components/guest/guest.component';
import { AdminHeaderComponent } from './components/admin/admin-header/admin-header.component';
import { ViewlogsheetsComponent } from './components/admin/viewlogsheets/viewlogsheets.component';
import { StaffLoginComponent } from './components/auth/staff-login/staff-login.component';
import { AuthGuard } from './auth.guard';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { UpdateDialogComponent } from './components/shared/update-dialog/update-dialog.component';
import { SignDialogComponent } from './components/admin/sign-dialog/sign-dialog.component';
import { SignLogsheetsComponent } from './components/admin/sign-logsheets/sign-logsheets.component';
import { SignupCodeComponent } from './components/auth/signup/signup-code/signup-code.component';
import { CreateEventCodeComponent } from './components/admin/event-code/event-code.component';
import { UpcomingEventsComponent } from './components/admin/upcoming-events/upcoming-events.component';
import { DeclarationLetterComponent } from './components/admin/declaration-letter/declaration-letter.component';
import { ViewDeclarationLettersComponent } from './components/admin/view-declaration-letters/view-declaration-letters.component';
import { ContactsModalComponent } from './components/contacts-modal/contacts-modal.component';
import { AboutusModalComponent } from './components/aboutus-modal/aboutus-modal.component';
import { GuestEventsComponent } from './components/student/guest-events/guest-events.component';
import { StaffCodesComponent } from './components/admin/staff-codes/staff-codes.component';
import { StaffSignupComponent } from './components/auth/staff-signup/staff-signup.component';
import { StaffSignupCodeComponent } from './components/auth/staff-signup/staff-sigup-code/staff-sigup-code.component';
import { UpdateLogsheetComponent } from './components/student/update-logsheet/update-logsheet.component';
import { ViewLogbooksComponent } from './components/admin/view-logbooks/view-logbooks.component';
import { LogbookComponent } from './components/student/logbook/logbook.component';
import { LetterComponent } from './components/student/letter/letter.component';
import { ViewReflectionsComponent } from './components/admin/view-reflections/view-reflections.component';
import { ViewPlacementsComponent } from './components/admin/view-placements/view-placements.component';
import { LogbookFileComponent } from './components/admin/logbook-file/logbook-file.component';
import { WilReportComponent } from './components/admin/wil-report/wil-report.component';
import { LogbookDialogComponent } from './components/shared/logbook-dialog/logbook-dialog.component';
import { ViewUsersComponent } from './components/admin/view-users/view-users.component';
import { UserTypeDialogComponent } from './components/admin/user-type-dialog/user-type-dialog.component';
import { StaffManagementComponent } from './components/admin/staff-management/staff-management.component';
import { MentorLogsheetsComponent } from './components/mentor/mentor-logsheets/mentor-logsheets.component';
import { MentorSignupComponent } from './components/auth/mentor-signup/mentor-signup.component';
import { HpcsaLoginComponent } from './components/auth/hpcsa-login/hpcsa-login.component';
import { MentorDeclarationLettersComponent } from './components/mentor/mentor-declaration-letters/mentor-declaration-letters.component';
import { MentorPlacementsComponent } from './components/mentor/mentor-placements/mentor-placements.component';
import { MentorReflectionsComponent } from './components/mentor/mentor-reflections/mentor-reflections.component';
import { MentorEventsComponent } from './components/mentor/mentor-events/mentor-events.component';
import { MentorEventManagementComponent } from './components/mentor/mentor-event-management/mentor-event-management.component';
import { MentorEventCodeComponent } from './components/mentor/mentor-event-code/mentor-event-code.component';
import { AttendanceRegisterComponent } from './components/shared/attendance-register/attendance-register.component';
import { MentorLoginComponent } from './components/auth/mentor-login/mentor-login.component';
import { HpcsaSignupComponent } from './components/auth/hpcsa-signup/hpcsa-signup.component';
import { HpcsaDashboardComponent } from './components/HPCSA/hpcsa-dashboard/hpcsa-dashboard.component';
import { HpcsaApplicationsComponent } from './components/HPCSA/hpcsa-applications/hpcsa-applications.component';
import { HpcsaDeclarationComponent } from './components/HPCSA/hpcsa-declaration/hpcsa-declaration.component';
import { HpcsaEventComponent } from './components/HPCSA/hpcsa-event/hpcsa-event.component';
import { HpcsaLogbooksComponent } from './components/HPCSA/hpcsa-logbooks/hpcsa-logbooks.component';
import { HpcsaLogsheetsComponent } from './components/HPCSA/hpcsa-logsheets/hpcsa-logsheets.component';
import { HpcsaPlacementComponent } from './components/HPCSA/hpcsa-placement/hpcsa-placement.component';
import { HpcsaReflectionComponent } from './components/HPCSA/hpcsa-reflection/hpcsa-reflection.component';
import { HpcsaHeaderComponent } from './components/HPCSA/hpcsa-header/hpcsa-header.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { ChartWrapperComponent } from './components/shared/chart-wrapper/chart-wrapper.component';
import { StudentApplicationEditComponent } from './components/student/student-application-edit/student-application-edit.component';
import { StudentApplicationsComponent } from './components/student/student-applications/student-applications.component';
import { StudentReflectionComponent } from './components/admin/student-reflection/student-reflection.component';

export const appRoutes: Routes = [
  // Default route
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'staff-signup', component: StaffSignupComponent },
  { path: 'staff-login', component: StaffLoginComponent },
  { path: 'mentor-signup', component: MentorSignupComponent },
  { path: 'mentor-login', component: MentorLoginComponent },
    { path: 'hpcsa-signup', component: HpcsaSignupComponent },
  { path: 'hpcsa-login', component: HpcsaLoginComponent },
  { path: 'signup/signup-code', component: SignupCodeComponent },
  {
    path: 'staff-signup/staff-signup-code',
    component: StaffSignupCodeComponent,
  },

  // Shared routes
  { path: 'home', component: HomeComponent },
  { path: 'chart-wrapper', component: ChartWrapperComponent },
  { path: 'guide', component: GuideComponent },
  { path: 'communication', component: CommunicationComponent },
  { path: 'benefits', component: BenefitsComponent },
  { path: 'confirmation-dialog', component: ConfirmationDialogComponent },
  { path: 'update-dialog', component: UpdateDialogComponent },
  { path: 'logbook-dialog/:studentNumber', component: LogbookDialogComponent },
  { 
    path: 'attendance-register', 
    component: AttendanceRegisterComponent,
  },

  // Admin routes
    { path: 'admin-header', component: AdminHeaderComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'user-type-dialog', component: UserTypeDialogComponent },
  { path: 'sign-dialog', component: SignDialogComponent },
  { path: 'sign-logsheets', component: SignLogsheetsComponent },
  { path: 'event-code', component: CreateEventCodeComponent },
  { path: 'staff-codes', component: StaffCodesComponent },
  { path: 'upcoming-events', component: UpcomingEventsComponent },
  { path: 'declaration-letter', component: DeclarationLetterComponent },
  { path: 'student-reflection', component: StudentReflectionComponent },
  {
    path: 'view-declaration-letters',
    component: ViewDeclarationLettersComponent,
  },
  { path: 'viewlogsheets', component: ViewlogsheetsComponent },
  { path: 'view-logbooks', component: ViewLogbooksComponent },
  { path: 'view-reflections', component: ViewReflectionsComponent },
  { path: 'view-users', component: ViewUsersComponent },
    { path: 'staff-management', component: StaffManagementComponent },
  { path: 'view-placements', component: ViewPlacementsComponent },
  {
    path: 'logbook-file/:studentNumber',
    component: LogbookFileComponent,
  },
  {
    path: 'wil-report/:studentNumber',
    component: WilReportComponent,
  },

  // Student routes
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'analytics-dashboard', component: AnalyticsDashboardComponent },
  { path: 'logsheet', component: LogsheetComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'reflections', component: ReflectionsComponent },
  { path: 'logform', component: LogformComponent },
  { path: 'logbook', component: LogbookComponent },
  { path: 'guest-events', component: GuestEventsComponent },
  { path: 'student-application', component: StudentApplicationComponent },
  { path: 'student-applications', component: StudentApplicationsComponent },
  { path: 'student-application-edit', component: StudentApplicationEditComponent },
  { path: 'update-student', component: UpdateStudentComponent },
  { path: 'update-logsheet', component: UpdateLogsheetComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'placement', component: PlacementComponent },
  { path: 'event-management', component: EventManagementComponent },
  { path: 'class-page', component: ClassPageComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'letter', component: LetterComponent },



  // Mentor routes
  {
    path: 'mentor-dashboard',
    component: MentorDashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'mentor-profile', component: MentorProfileComponent },
  { path: 'declaration-report', component: DeclarationReportComponent },
  { path: 'placement-performance', component: PlacementPerformanceComponent },
  { path: 'mentor-guide', component: MentorGuideComponent },
  { path: 'mentor-logsheets', component: MentorLogsheetsComponent },
  { path: 'mentor-placements', component: MentorPlacementsComponent },
  { path: 'mentor-logbooks', component: MentorLogbooksComponent },
  { path: 'mentor-reflections', component: MentorReflectionsComponent },
  { path: 'mentor-events', component: MentorEventsComponent },
  { path: 'mentor-event-management', component: MentorEventManagementComponent },
  { path: 'mentor-event-code', component: MentorEventCodeComponent },
  { path: 'mentor-declaration-letters', component: MentorDeclarationLettersComponent },

  // HPCSA routes
    { path: 'hpcsa-header', component: HpcsaHeaderComponent },
  { path: 'auditors', component: AuditorsComponent },
  { path: 'compliance-report', component: ComplianceReportComponent },
  { path: 'student-logbook-viewer', component: StudentLogbookViewerComponent },
  {path: 'hpcsa-dashboard', component: HpcsaDashboardComponent},
  {path: 'hpcsa-applications', component: HpcsaApplicationsComponent},
  {path: 'hpcsa-logsheets', component: HpcsaLogsheetsComponent},
  {path: 'hpcsa-logbooks', component: HpcsaLogbooksComponent},  
  { path: 'hpcsa-declaration', component: HpcsaDeclarationComponent },
  { path: 'hpcsa-placement', component: HpcsaPlacementComponent },
  { path: 'hpcsa-event', component: HpcsaEventComponent },
  { path: 'hpcsa-reflection', component: HpcsaReflectionComponent },

  

  // Miscellaneous routes
  { path: 'agreement', component: AgreementComponent },
  { path: 'guest', component: GuestComponent },
  { path: 'contacts-modal', component: ContactsModalComponent },
  { path: 'aboutus-modal', component: AboutusModalComponent },
  { path: 'event-management/pn-dialog', component: PinDialogComponent },
  { path: 'guest/pn-dialog', component: PinDialogComponent },

  // Fallback route (404)
  { path: '**', redirectTo: '/home' },
];

export const appConfig = [provideRouter(appRoutes)];
