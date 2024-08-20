import { Component, inject, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { ChannelService } from '../../services/channel.service';
import { User } from '../../models/user.class';
import { UserService } from '../../services/user.service';

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
  channelService = inject(ChannelService);
  userService = inject(UserService);

  /**
   * set user avatar img
   * fallback to placeholder, if no img set
   * @param user 
   * @returns 
   */
  setAvatarImg(user: User){
    if (user.avatar !== '') {
      return user.avatar;
    } else {
      return 'assets/img/chars/profile_placeholder.png';
    }
  }
  

}
