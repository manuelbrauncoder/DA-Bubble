import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserAndLogoutPopupComponent } from './edit-user-and-logout-popup/edit-user-and-logout-popup.component';
import { EditProfileComponent } from '../../edit-profile/edit-profile.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, EditUserAndLogoutPopupComponent, EditProfileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isActive = false;


  togglePopup() {
    this.isActive = !this.isActive;
  }
}