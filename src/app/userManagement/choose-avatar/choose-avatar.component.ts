import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  selectedAvatar: string = '';
  avatarIsSelected: boolean = false;

  regData = this.authService.getStoredRegistrationData();

  completeRegistration() {
    if (this.regData) {
      this.authService.register(this.regData.email, this.regData.username, this.regData.password, this.selectedAvatar).subscribe(() => {
        console.log('Registration complete with avatar:', this.selectedAvatar);
        this.authService.clearStoredRegistrationData();
        this.router.navigate(['/login']);
      });
    } else {
      console.error('No registration data found!');
    }
  }
}
