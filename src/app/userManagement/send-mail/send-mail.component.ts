import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-send-mail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-mail.component.html',
  styleUrl: './send-mail.component.scss'
})
export class SendMailComponent {
  authService = inject(FirebaseAuthService);

  email: string = '';

  sendMail() {
    try {
      this.authService.sendPasswordResetMail(this.email);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
