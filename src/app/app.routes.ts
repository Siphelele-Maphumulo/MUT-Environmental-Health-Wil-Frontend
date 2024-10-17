import { Routes } from '@angular/router';
import { HomeComponent } from './shared/guide/home/home.component';
//import { LoginComponent } from './login/login.component';
//import { SignupComponent } from './signup/signup.component';
import { GuideComponent } from './shared/guide/guide.component';
import { LogsheetComponent } from './logsheet/logsheet.component';

import { StudentApplicationComponent } from './components/student-application/student-application.component';
import { StudentsReflectionsComponent } from './components/students-reflections/students-reflections.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { FormsComponent } from './components/forms/forms.component';

import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UpdateapplicationComponent } from './components/updateapplication/updateapplication.component';
import { LogbookComponent } from './components/logbook/logbook.component';
import { UpdateStaffComponent } from './components/update-staff/update-staff.component';
import { UpdateStudentComponent } from './components/update-student/update-student.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';



export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  //{ path: 'login', component: LoginComponent },
  //{ path: 'signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },     // Login route
  { path: 'auth/signup', component: SignupComponent },

  { path: 'guide', component: GuideComponent },
  {path: 'home', component: HomeComponent },
  {path: 'logsheet', component: LogsheetComponent },
  {path: 'agreement', component: AgreementComponent },
  {path: 'student-application', component: StudentApplicationComponent },
  {path: 'students-reflections', component: StudentsReflectionsComponent},
  {path: 'forms', component: FormsComponent},
  { path: 'update-staff', component: UpdateStaffComponent },
  { path: 'update-student', component: UpdateStudentComponent },
  { path: 'updateapplication', component: UpdateapplicationComponent },     // Login route
  { path: 'logbook', component: LogbookComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  
];
