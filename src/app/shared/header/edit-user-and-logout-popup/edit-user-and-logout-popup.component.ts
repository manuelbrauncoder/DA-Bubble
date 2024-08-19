import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { UiService } from '../../../services/ui.service';


@Component({
  selector: 'app-edit-user-and-logout-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-user-and-logout-popup.component.html',
  styleUrl: './edit-user-and-logout-popup.component.scss'
})
export class EditUserAndLogoutPopupComponent {
  uiService = inject(UiService);
  authService = inject(FirebaseAuthService);


  viewProfile() {

  }


  logout() {
    this.authService.logout()
  }
}