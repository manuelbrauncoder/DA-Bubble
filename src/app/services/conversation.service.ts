/**
 * This Service File is for handling everything about conversations
 */

import { inject, Injectable } from '@angular/core';
import { UiService } from './ui.service';
import { User } from '../models/user.class';
import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';
import { Conversation } from '../models/conversation.class';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  fireService = inject(FirestoreService);
  uiService = inject(UiService);
  userService = inject(UserService);


  constructor() { }

  /**
   * change main content to 'directMessage'
   * and set the Conversation between the users,
   * 
   * @param secondUser is the User you want to chat with
   */
  openConversation(secondUser: User) {
    this.setCurrentConversation(secondUser);
    this.uiService.changeMainContent('directMessage');
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
    let conversation = this.conversationexist(firstUser, secondUser);
    if (conversation) {
      this.fireService.currentConversation = new Conversation(conversation);
    } else {
      this.fireService.currentConversation = new Conversation();
      this.fireService.currentConversation.participants.first = firstUser;
      this.fireService.currentConversation.participants.second = secondUser;
      this.fireService.addConversation(this.fireService.currentConversation);
    }
  }

  /**
   * 
   * @param secondUser is the User you want do chat with
   * @returns false if the conversations do not exist, or
   * returns the conversation
   */
  conversationexist(firstUser: User, secondUser: User): Conversation | false {
    for (let i = 0; i < this.fireService.conversations.length; i++ ) {
      const conversation = this.fireService.conversations[i];
      const participants = conversation.participants;
      if ((participants.first.uid === firstUser.uid && participants.second.uid === secondUser.uid) ||
        (participants.first.uid === secondUser.uid && participants.second.uid === firstUser.uid)) {
          console.log('Conversation gefunden!', conversation);
          
        return conversation;
      }
    }
    console.log('keine Conversation gefunden, erstelle neue!');
    
    return false;
  }

 


  /**
   * Wird vermutlich nicht gebraucht!!
   * @param activeConversation 
   */
  toggleActiveConversation(activeConversation: Conversation) {
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
