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
  showPopup: boolean = false;

  async sendMail() {
    try {
      await this.authService.sendPasswordResetMail(this.email);
      this.showPopup = true;
      setTimeout(() => this.showPopup = false, 3000);
    } catch (error) {
    }
  }
}
