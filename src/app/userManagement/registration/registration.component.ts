import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);

  username: any = '';
  email: any = '';
  pwd: any = '';
  privacy: boolean = false;

    /**
   * Login for user. Checks if email and pwd is in the database
   * and link to the main page.
   */
  register() {
    try {
      this.authService.register(this.email, this.username, this.pwd);
      // this.router.navigate(['/profilePic']);
    } catch (error) {
      console.error(error);
    }
  }

}
