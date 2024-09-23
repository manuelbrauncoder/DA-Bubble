import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UiService } from '../../../services/ui.service';
import { Conversation } from '../../../models/conversation.class';
import { Channel } from '../../../models/channel.class';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-popup-taggable-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-taggable-users.component.html',
  styleUrl: './popup-taggable-users.component.scss',
})
export class PopupTaggableUsersComponent {
  uiService = inject(UiService);
  userService = inject(UserService);

  @Input() currentRecipient: Conversation | Channel = new Channel(); // Empfänger der Nachricht
  @Output() userTagged = new EventEmitter<string>();

  /**
   * Retrieves the users associated with the current channel.
   * @returns {User[]} An array of users in the current channel, or an empty array if the recipient is not a channel.
   */
  getChannelUsers() {
    let users: User[] = [];

    if (this.currentRecipient instanceof Channel) {
      this.currentRecipient.users.forEach((userUid) => {
        const user = this.userService.getUserData(userUid);
        users.push(user);
      });
      return users;
    } else {
      return [];
    }
  }

  /**
   * Emits an event with the tagged user's username and closes the popup.
   * @param {string} username - The username of the tagged user.
   */
  tagThisUser(username: string) {
    this.userTagged.emit(username);
    this.closePopup();
  }

  /**
   * Closes the popup for selecting taggable users.
   */
  closePopup() {
    this.uiService.toggleTaggableUsersPopup();
  }
}