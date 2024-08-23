import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-change-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './change-avatar.component.html',
  styleUrl: './change-avatar.component.scss',
})
export class ChangeAvatarComponent {
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);
  userService = inject(UserService);
  selectedAvatar: string = this.userService.getCurrentUsersAvatar();


  selectNewAvatar(imgPath: string) {
    this.selectedAvatar = imgPath;
  }


  // not working yet
  confirmNewSelectedAvatar() {

  }


  closeChangeAvatar() {
    this.uiService.toggleChangeAvatar();
  }
}