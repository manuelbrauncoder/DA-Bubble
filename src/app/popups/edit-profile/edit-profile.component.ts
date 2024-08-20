import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);

  profileData = {
    name:  '',
    email: ''
  }


  saveEdit(newEmail: string) {
    this.authService.updateUserEmail(newEmail);
    console.log(this.profileData);
  }

  
  closeEditProfile() {
    this.uiService.toggleEditProfile();
    this.uiService.toggleViewProfile();
  }
}