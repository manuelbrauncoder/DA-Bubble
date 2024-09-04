import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserAndLogoutPopupComponent } from '../../popups/edit-user-and-logout-popup/edit-user-and-logout-popup.component';
import { UiService } from '../../services/ui.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { UserService } from '../../services/user.service';
import { fadeIn } from '../animations';


@Component({
  selector: 'app-header',
  animations: [fadeIn],
  standalone: true,
  imports: [CommonModule, EditUserAndLogoutPopupComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  uiService = inject(UiService);
  firestoreService = inject(FirestoreService);
  authService = inject(FirebaseAuthService);
  userService = inject(UserService);


  openPopup() {
    this.uiService.toggleEditUserAndLogoutPopup();
  }
}