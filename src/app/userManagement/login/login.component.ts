import { Component, inject, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { UiService } from '../../services/ui.service';

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
  uiService = inject(UiService);
  loginFailed: boolean = false;
  showStartScreen: boolean = true;
  startScreenFadeOut: boolean = false;
  logoState: 'center' | 'corner' = 'center';

  loginData = {
    email: '',
    password: ''
  }

  /**
   * ngOnInit lifecycle hook for Angular component.
   * It initiates a series of animations to move the logo from the center to the corner
   * and fades out the start screen.
   */
  ngOnInit() {
    setTimeout(() => {
      this.logoState = 'corner';
      setTimeout(() => {
        this.startScreenFadeOut = true;
        setTimeout(() => {
          this.showStartScreen = false;
          this.uiService.introAnimationPlayed = true;
        }, 500);
      }, 1500);
    }, 500);
  }

  /**
   * Handles the "Enter" keypress during login.
   * If the form is valid and the "Enter" key is pressed, the login process is triggered.
   * 
   * @param event - The keyboard event triggered by pressing a key.
   * @param loginForm - The login form containing user credentials.
   */
  onKeyDownEnter(event: KeyboardEvent, loginForm: NgForm) {
    if (event.key === 'Enter' && loginForm.valid) {
      event.preventDefault();      
      this.login();
    }
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
          this.loginFailed = true;
          return of(null);  
        })
      )
      .subscribe(() => {
        if (!this.loginFailed) {
          this.router.navigate(['/dabubble']);
        }
      });
  }

  /**
   * Guestlogin. Links to the main page.
   */
  async guestLogin() {
    try {
      await this.authService.guestLogin();
      this.router.navigate(['/dabubble']);
    } catch (error) {
      this.loginFailed = true;
    }
  }

  /**
   * Googlelogin. Uses Method from Authservice. After login links to the main page.
   */
  async googleLogin() {
    try {
      await this.authService.googleLogin();
      this.router.navigate(['/dabubble']);
    } catch (error) {
      this.loginFailed = true;
    }
  }
}