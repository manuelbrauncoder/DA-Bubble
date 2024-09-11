import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {
  authService = inject(FirebaseAuthService);
  uiService = inject(UiService);
  fireService = inject(FirestoreService);
  channelService = inject(ChannelService);
  userService = inject(UserService);
  conversationService = inject(ConversationService);

  openNewMessage() {
    this.uiService.changeMainContent('newMessage');
    this.uiService.channelChatNotActive();
    this.uiService.userChatNotActive();
  }
 
}
