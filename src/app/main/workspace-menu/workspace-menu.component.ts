import { Component, inject, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent{
  authService = inject(FirebaseAuthService);

  currentUser = this.authService.auth.currentUser?.displayName;

  showChannels: boolean = false;
  showDirectMessages: boolean = true;

  toggleDirectMessages(){
    this.showDirectMessages = !this.showDirectMessages;
  }

}
