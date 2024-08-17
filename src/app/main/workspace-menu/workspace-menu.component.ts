import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {
  authService = inject(FirebaseAuthService);

}
