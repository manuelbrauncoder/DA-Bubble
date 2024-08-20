import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  loginFailed: boolean = false;

  loginData = {
    email: '',
    password: ''
  }

    /**
   * Login for user. Checks if email and pwd is in the database
   * and link to the main page.
   */
  async login() {
    this.loginFailed = false;
    this.authService.login(this.loginData.email, this.loginData.password)
      .pipe(
        catchError((error) => {
          console.error('Login error in LoginComponent:', error);
          this.loginFailed = true;
          return of(null);  
        })
      )
      .subscribe(() => {
        if (!this.loginFailed) {
          this.router.navigate(['/']);
        }
      });
  }

    /**
   * Guestlogin. Links to the main page.
   */
  async guestLogin() {
    try {
      await this.authService.guestLogin();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Guest login error in LoginComponent:', error);
    }
  }
}
