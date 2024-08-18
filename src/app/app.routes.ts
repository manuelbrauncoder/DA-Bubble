import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './userManagement/login/login.component';
import { RegistrationComponent } from './userManagement/registration/registration.component';
import { MainContentComponent } from './main/main-content/main-content.component';

export const routes: Routes = [
  { path: '', component: MainContentComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent }
];
