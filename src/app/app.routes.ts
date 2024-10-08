import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './userManagement/login/login.component';
import { RegistrationComponent } from './userManagement/registration/registration.component';
import { MainContentComponent } from './main/main-content/main-content.component';
import { ChooseAvatarComponent } from './userManagement/choose-avatar/choose-avatar.component';
import { SendMailComponent } from './userManagement/send-mail/send-mail.component';
import { ResetPasswordComponent } from './userManagement/reset-password/reset-password.component';
import { PrivacyPoliciyComponent } from './privacy-policiy/privacy-policiy.component';
import { ImprintComponent } from './imprint/imprint.component';


export const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'dabubble', component: MainContentComponent},
  { path: 'registration', component: RegistrationComponent },
  { path: 'avatar', component: ChooseAvatarComponent },
  { path: 'sendmail', component: SendMailComponent },
  { path: 'resetpwd', component: ResetPasswordComponent },
  { path: 'privacy_policy', component: PrivacyPoliciyComponent },
  { path: 'imprint', component: ImprintComponent },

];
