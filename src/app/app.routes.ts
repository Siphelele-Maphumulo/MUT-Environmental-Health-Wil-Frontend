import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GuideComponent } from './guide/guide.component';
import { LogsheetComponent } from './logsheet/logsheet.component';


export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'guide', component: GuideComponent },
  {path: 'home', component: HomeComponent },
  {path: 'logsheet', component: LogsheetComponent },
];
