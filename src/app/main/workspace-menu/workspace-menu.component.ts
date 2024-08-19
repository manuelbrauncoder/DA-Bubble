import { Component, inject, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent{
  authService = inject(FirebaseAuthService);
  uiService = inject(UiService);
  fireService = inject(FirestoreService);

  currentUser = this.authService.auth.currentUser?.displayName;

  

}
