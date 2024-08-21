import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FormsModule } from '@angular/forms';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, VerifyPasswordComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);

  editProfileData = {
    name:  '',
    email: ''
  }

  // newEmailAddress: string = this.editProfileData.email;


  // this function is not working yet
  saveEdit(newName: string, newEmail: string) {
    // this.saveNewName(newName);
    this.saveNewEmailAddress(newEmail);    
  }


  saveNewName(newName: string) {

  }


  saveNewEmailAddress(newEmail: string) {
    // this.newEmailAddress = newEmail;
    // newEmail = this.newEmailAddress
    this.authService.newEmailAddress = newEmail;
    this.authService.updateUserEmail(newEmail);
  }

  
  closeEditProfile() {
    this.uiService.toggleEditProfile();
    this.uiService.toggleViewProfile();
  }
}