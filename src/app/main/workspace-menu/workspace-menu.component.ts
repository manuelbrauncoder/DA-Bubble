import { Component, inject, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.class';
import { Conversation } from '../../models/conversation.class';

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


  /**
   * change main content to 'directMessage'
   * and set the Conversation between the users,
   * 
   * @param secondUser is the User you want to chat with
   */
  openConversation(secondUser: User) {
    this.setCurrentConversation(secondUser);
    this.uiService.changeMainContent('directMessage');
    console.log(this.fireService.currentConversation);
  }

  /**
   * if the conversation between logged in User and secondUser already exists,
   * it opens the conversation
   * if not, it creates a new Conversation and save it in firebase
   * 
   * @param secondUser is the User you want to chat with
   */
  setCurrentConversation(secondUser: User) {
    let firstUser = this.userService.getCurrentUser();
    let conversation: false | Conversation = this.conversationexist(secondUser);
    if (conversation === false) {
      this.fireService.currentConversation = new Conversation();
      this.fireService.currentConversation.participants.first = firstUser;
      this.fireService.currentConversation.participants.second = secondUser;
      this.fireService.addConversation(this.fireService.currentConversation);
    } else if (conversation instanceof User) {
      this.fireService.currentConversation = new Conversation(conversation);
    }
  }

  /**
   * 
   * @param secondUser is the User you want do chat with
   * @returns false if the conversations do not exist, or
   * returns the conversation
   */
  conversationexist(secondUser: User): Conversation | false {
    let firstUser = this.userService.getCurrentUser();
    for (let conversation of this.fireService.conversations) {
      const participants = conversation.participants;
      if ((participants.first.uid === firstUser.uid && participants.second.uid === secondUser.uid) ||
        (participants.first.uid === secondUser.uid && participants.second.uid === firstUser.uid)) {
        return conversation;
      }
    }
    return false;
  }


  /**
   * Wird vermutlich nicht gebraucht!!
   * @param activeConversation 
   */
  toggleActiveConversation(activeConversation: Conversation){
    this.fireService.conversations.forEach((conversation) => {
      if (conversation.id === activeConversation.id) {
        conversation.active = true;
        this.fireService.currentConversation = new Conversation(conversation);
      } else {
        conversation.active = false;
      }
    })
  }
}
