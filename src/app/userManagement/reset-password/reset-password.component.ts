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


  ngOnInit() {
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode') || '';
    if (!this.oobCode) {
      this.errorMessage = 'Ungültiger oder fehlender Code. Bitte überprüfen Sie den Link in Ihrer E-Mail.';
    }
  }

  isFormValid(): boolean {
    return this.firstPassword.length >= 6 && this.secondPassword.length >= 6 && this.firstPassword === this.secondPassword;
  }

  async changePassword() {
    if (this.isFormValid()) {
      try {
        await this.authService.verifyPasswordResetCode(this.oobCode);
        await this.authService.confirmPasswordReset(this.oobCode, this.firstPassword);
        alert('Passwort erfolgreich geändert.');
        this.router.navigate(['/login']);
      } catch (error) {
        this.errorMessage = 'Fehler beim Zurücksetzen des Passworts.';
        console.error('Error:', error);
      }
    }
  }
}
