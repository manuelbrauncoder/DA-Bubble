import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FormsModule } from '@angular/forms';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.class';
// import { ProfileChangeConfirmationComponent } from '../profile-change-confirmation/profile-change-confirmation.component';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, VerifyPasswordComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit {
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);
  userService = inject(UserService);
  currentUsersAvatar = this.userService.getCurrentUsersAvatar();
  selectedAvatar: string = '';
  avatarIsChanged: boolean = false;
  nameIsChanged: boolean = false;
  emailIsChanged: boolean = false;

  updatedUser: User = new User();

  editProfileData = {
    name: '',
    email: '',
  };


  /**
   * Initializes the component, setting the current user's name and email.
   */
  ngOnInit(): void {
    this.editProfileData.name = this.authService.auth.currentUser?.displayName!;
    this.editProfileData.email = this.authService.auth.currentUser?.email!;
  }


  /**
   * Saves changes to the profile if any edits have been made.
   * Updates the avatar, name, and email, then closes the edit profile view and shows a confirmation popup.
   * @param newName - The new name entered by the user.
   * @param newEmail - The new email entered by the user.
   */
  saveEdit_OLD(newName: string, newEmail: string) {
    if (this.avatarIsChanged || this.nameIsChanged || this.emailIsChanged) {
      this.saveNewAvatar();
      // this.saveNewName(newName: string);  // this function is not working yet
      this.saveNewEmailAddress(newEmail);
      // this.closeEditProfile();
      // this.uiService.toggleProfileChangeConfirmationPopup();
    }
  }

  saveEdit(newName: string, newEmail: string) {
    if (this.avatarIsChanged) {
      this.saveNewAvatar();
      this.uiService.toggleProfileChangeConfirmationPopup();
    } else if (this.emailIsChanged) {
      this.saveNewAvatar();
      this.saveNewEmailAddress(newEmail);
    }
  }


  /**
   * Placeholder method for uploading a custom profile picture.
   */
  uploadOwnPicture() { }


  /**
   * Opens the container for changing the user's avatar.
   */
  openChangeAvatarContainer() {
    this.currentUsersAvatar = this.userService.getCurrentUsersAvatar();
    this.uiService.toggleChangeAvatarContainer();
  }


  /**
   * Selects a new avatar for the user and updates the relevant data.
   * @param imgPath - The file path of the selected avatar image.
   */
  selectNewAvatar(imgPath: string) {
    this.avatarIsChanged = true;
    this.selectedAvatar = imgPath;
    this.currentUsersAvatar = imgPath;
    this.updatedUser = new User(this.userService.getCurrentUser());
    this.updatedUser.avatar = imgPath;
    console.log(this.updatedUser);
  }


  /**
   * Closes the avatar change container without saving changes.
   */
  closeChangeAvatarContainer() {
    this.currentUsersAvatar = this.userService.getCurrentUsersAvatar();
    this.uiService.toggleChangeAvatarContainer();
  }


  /**
   * Confirms the selected avatar and closes the avatar change container.
   * But the selected avatar is not saved yet at this point.
   */
  confirmNewSelectedAvatar() {
    this.uiService.toggleChangeAvatarContainer();
  }


  /**
   * Saves the new avatar if it has been changed.
   * Updates the user data in Firestore.
   */
  saveNewAvatar() {
    if (this.avatarIsChanged) {
      this.firestoreService.addUser(this.updatedUser);
      this.avatarIsChanged = false;
    }
  }


  /**
   * Marks the user's name as changed.
   */
  onNameChange() {
    this.nameIsChanged = true;
  }


  // // this function is not working yet
  // saveNewName(newName: string) {
  //   if (this.nameIsChanged) {
  //     this.nameIsChanged = false;
  //   }
  // }


  /**
   * Marks the user's email as changed.
   */
  onEmailChange() {
    this.emailIsChanged = true;
  }


  /**
   * Saves the new email address if it has been changed.
   * Updates the user's email in Firebase Authentication.
   * @param newEmail - The new email address entered by the user.
   */
  saveNewEmailAddress(newEmail: string) {
    if (this.emailIsChanged) {
      this.authService.newEmailAddress = newEmail;
      this.authService.updateUserEmail(newEmail);
      this.emailIsChanged = false;
    }
  }


  /**
   * Closes the edit profile view and reopens the view profile view.
   */
  closeEditProfile() {
    this.uiService.toggleEditProfile();
    this.uiService.toggleViewProfile();
  }
}