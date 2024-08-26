import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';


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
  userService = inject(UserService);

  verifyPasswordData = {
    name:  '',
    email: '',
    password: ''
  }
  

  /**
   * Initializes the component, setting the current user's name and email.
   */
  ngOnInit(): void {
    this.verifyPasswordData.name = this.authService.auth.currentUser?.displayName!;
    this.verifyPasswordData.email = this.authService.auth.currentUser?.email!;
  }


  /**
   * Confirms the user's password for re-authentication.
   * Updates the email if the password is correct, then closes the verify password view and toggles the Edit User and Logout Popup.
   * @param name - The user's name.
   * @param email - The user's email address.
   * @param password - The user's password.
   */
  confirmPassword(name: string, email: string, password: string) {
    this.authService.updateEmail = true;
    this.authService.reAuthenticateUser(email, password);
    this.closeVerifyPassword();
    this.uiService.toggleEditUserAndLogoutPopup();
  }

  
  /**
   * Closes the verify password view.
   */
  closeVerifyPassword() {
    this.uiService.toggleVerifyPassword();
  }
}