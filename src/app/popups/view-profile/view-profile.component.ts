import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';


@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss',
})
export class ViewProfileComponent {
  uiService = inject(UiService);


  closeViewProfile() {
    this.uiService.toggleViewProfile();
  }


  editProfile() {

  }
}