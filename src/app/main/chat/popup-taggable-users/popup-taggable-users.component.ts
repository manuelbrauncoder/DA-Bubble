import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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


  tagThisUser() {
    console.log('Diesen User in der Nachricht markieren.');
  }


  closePopup() {
    this.uiService.toggleTaggableUsersPopup();
  }
}