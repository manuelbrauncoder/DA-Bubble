import { Component, inject, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';
import { UiService } from '../../../services/ui.service';
import { ConversationService } from '../../../services/conversation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-view-other-users-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-view-other-users-profile.component.html',
  styleUrl: './popup-view-other-users-profile.component.scss'
})
export class PopupViewOtherUsersProfileComponent implements OnInit {
  userService = inject(UserService);
  uiService = inject(UiService);
  conversationService = inject(ConversationService);
  user: User | null = null;

  /**
   * Angular lifecycle hook - Called when the component is initialized.
   * Retrieves the data of the user whose profile is to be viewed.
   * @returns {void} No return value.
   */
  ngOnInit(): void {
    this.user = this.userService.getUserData(this.userService.uidForProfile);
  }

  /**
   * Closes the popup that displays another user's profile.
   */
  closeOtherUsersProfile() {
    this.uiService.toggleOtherUsersProfile();
  }

  /**
   * Checks the current status of the user and returns the corresponding CSS class.
   * @returns {string} The CSS class that corresponds to the user's status.
   * Possible values: 'statusOnline', 'statusAway', or 'statusOffline'.
   */
  checkStatus(): string {
    if (this.user?.status === 'online') {
      return 'statusOnline'
    } else if (this.user?.status === 'away') {
      return 'statusAway'
    } else {
      return 'statusOffline'
    }
  }

  /**
   * Initiates a direct message conversation with the specified user.
   * Closes the user's profile popup after the conversation is opened.
   * @param {any} user - The user object for whom the conversation will be opened.
   */
  directMessageToThisUser(user: any) {
    this.conversationService.openConversation(user);
    this.closeOtherUsersProfile();
  }
}