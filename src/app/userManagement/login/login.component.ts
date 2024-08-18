import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);

  email: any = '';
  pwd: any = '';


    /**
   * Login for user. Checks if email and pwd is in the database
   * and link to the main page.
   */
  login() {
    try {
      this.authService.login(this.email, this.pwd);
      // this.router.navigate(['/']);
    } catch (error) {
      console.error(error);
    }
  }

    /**
   * Guestlogin. Links to the main page.
   */
  guestLogin() {
    try {
      this.authService.guestLogin();
      // this.router.navigate(['/']);
    } catch (error) {
      console.error(error);
    }
  }
}
