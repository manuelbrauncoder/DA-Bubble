import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-workspace-menu-button',
  standalone: true,
  imports: [],
  templateUrl: './workspace-menu-button.component.html',
  styleUrl: './workspace-menu-button.component.scss'
})
export class WorkspaceMenuButtonComponent {
  uiService = inject(UiService);
}
