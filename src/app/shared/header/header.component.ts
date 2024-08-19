import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserAndLogoutPopupComponent } from './edit-user-and-logout-popup/edit-user-and-logout-popup.component';
import { UiService } from '../../services/ui.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, EditUserAndLogoutPopupComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  uiService = inject(UiService);
  
}