import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-password.component.html',
  styleUrl: './verify-password.component.scss'
})
export class VerifyPasswordComponent {
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);
  editProfileComponent = inject(EditProfileComponent);

  verifyPasswordData = {
    name:  '',
    email: '',
    password: ''
  }


  confirmPassword(name: string, email: string, password: string) {
    this.authService.reAuthenticateUser(email, password);
    this.editProfileComponent.saveNewEmailAddress(this.editProfileComponent.newEmailAddress);
    this.closeVerifyPassword();
    this.uiService.toggleEditUserAndLogoutPopup();
  }

  
  closeVerifyPassword() {
    this.uiService.toggleVerifyPassword();
  }
}