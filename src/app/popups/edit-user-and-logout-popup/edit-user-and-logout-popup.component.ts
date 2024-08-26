import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { ProfileChangeConfirmationComponent } from '../profile-change-confirmation/profile-change-confirmation.component';


@Component({
  selector: 'app-edit-user-and-logout-popup',
  standalone: true,
  imports: [CommonModule, ViewProfileComponent, ProfileChangeConfirmationComponent],
  templateUrl: './edit-user-and-logout-popup.component.html',
  styleUrl: './edit-user-and-logout-popup.component.scss'
})
export class EditUserAndLogoutPopupComponent {
  uiService = inject(UiService);
  authService = inject(FirebaseAuthService);


  viewProfile() {
    this.uiService.toggleViewProfile();
  }


  logout() {
    this.authService.logout()
  }
}