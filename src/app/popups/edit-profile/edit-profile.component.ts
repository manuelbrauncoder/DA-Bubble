import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  uiService = inject(UiService);

  
  closeEditProfile() {
    this.uiService.toggleEditProfile();
    this.uiService.toggleViewProfile();
  }
}