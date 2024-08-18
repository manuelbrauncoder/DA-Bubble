import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './userManagement/login/login.component';
import { RegistrationComponent } from './userManagement/registration/registration.component';

export const routes: Routes = [
  { path: '', component: AppComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent }
];
