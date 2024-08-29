import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  firstPassword: any = '';
  secondPassword: string = '';
  oobCode: string = '';
  errorMessage: string = '';
  showPopup: boolean = false;


    /**
   * This method is used to get the oobCode from Firebase and gives an error
   * if there is no code.
   */
  ngOnInit() {
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode') || '';
    if (!this.oobCode) {
      this.errorMessage = 'Ungültiger oder fehlender Code. Bitte überprüfen Sie den Link in Ihrer E-Mail.';
    }
  }

    /**
   * This method is used to check if the form is valid. Both inputs over 6
   * fields long and the first input matches the second one
   */
  isFormValid(): boolean {
    return this.firstPassword.length >= 6 && this.secondPassword.length >= 6 && this.firstPassword === this.secondPassword;
  }

    /**
   * This method is used for actually submit the new password. If the Form is
   * valid the method uses two firebase methods to check if the oobCode is 
   * legit and then resets the pwd. Throws an error if something went wrong
   * @param oobCode 
   * @param firstPassword
   */
  async changePassword() {
    if (this.isFormValid()) {
      try {
        await this.authService.verifyPasswordResetCode(this.oobCode);
        await this.authService.confirmPasswordReset(this.oobCode, this.firstPassword);
        this.showPopup = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      } catch (error) {
        this.errorMessage = 'Fehler beim Zurücksetzen des Passworts.';
        console.error('Error:', error);
      }
    }
  }
}
