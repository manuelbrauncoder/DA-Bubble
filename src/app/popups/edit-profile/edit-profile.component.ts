import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FormsModule } from '@angular/forms';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, VerifyPasswordComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit{
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);
  userService = inject(UserService);

  editProfileData = {
    name:  '',
    email: ''
  }

  
  ngOnInit(): void {
    this.editProfileData.name = this.authService.auth.currentUser?.displayName!;
    this.editProfileData.email = this.authService.auth.currentUser?.email!;
  }

  
  saveEdit(newName: string, newEmail: string) {
    // this.changeAvatar(); // this function is not working yet
    // this.saveNewName(newName: string); // this function is not working yet
    this.saveNewEmailAddress(newEmail);    
  }


  changeAvatar() {

  }


  saveNewName(newName: string) {

  }


  saveNewEmailAddress(newEmail: string) {
    this.authService.newEmailAddress = newEmail;
    this.authService.updateUserEmail(newEmail);
  }

  
  closeEditProfile() {
    this.uiService.toggleEditProfile();
    this.uiService.toggleViewProfile();
  }
}