import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-edit-user-and-logout-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-user-and-logout-popup.component.html',
  styleUrl: './edit-user-and-logout-popup.component.scss'
})
export class EditUserAndLogoutPopupComponent {
  viewProfile() {

  }


  logout() {

  }
}