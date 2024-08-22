import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-password',
  standalone: true,
  imports: [CommonModule, FormsModule, EditProfileComponent],
  templateUrl: './verify-password.component.html',
  styleUrl: './verify-password.component.scss'
})
export class VerifyPasswordComponent implements OnInit{
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);

  verifyPasswordData = {
    name:  '',
    email: '',
    password: ''
  }

  ngOnInit(): void {
    this.verifyPasswordData.name = this.authService.auth.currentUser?.displayName!;
    this.verifyPasswordData.email = this.authService.auth.currentUser?.email!;
  }


  confirmPassword(name: string, email: string, password: string) {
    this.authService.updateEmail = true;
    this.authService.reAuthenticateUser(email, password);
    this.closeVerifyPassword();
    this.uiService.toggleEditUserAndLogoutPopup();
  }

  
  closeVerifyPassword() {
    this.uiService.toggleVerifyPassword();
  }
}