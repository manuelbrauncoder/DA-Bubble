/**
 * This Service File is for handling everything about conversations
 */

import { inject, Injectable } from '@angular/core';
import { UiService } from './ui.service';
import { User } from '../models/user.class';
import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';
import { Conversation, Participants } from '../models/conversation.class';

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
    this.uiService.showThread = false;
  }

  /**
   * if the conversation between logged in User and secondUser already exists,
   * it opens the conversation
   * if not, it creates a new Conversation and save it in firebase
   * 
   * @param secondUser is the User you want to chat with
   */
  async setCurrentConversation(secondUser: User) {
    let firstUser = this.userService.getCurrentUser();
    let conversation = this.findConversation(firstUser, secondUser);
    if (conversation) {
      this.fireService.currentConversation = new Conversation(conversation);
    } else {
      await this.createNewConversation(firstUser, secondUser);
    }
    this.fireService.getMessagesPerDayForConversation();
  }

  /**
   * 
   * @param secondUser is the User you want do chat with
   * @returns false if the conversations do not exist, or
   * returns the conversation
   */
  findConversation(firstUser: User, secondUser: User): Conversation | false {
    for (let i = 0; i < this.fireService.conversations.length; i++) {
      const conversation = this.fireService.conversations[i];
      const participants = conversation.participants;
      if (this.participantExist(participants, firstUser, secondUser)) {
        console.log('Conversation gefunden!', conversation);
        return conversation;
      }
    }
    console.log('keine Conversation gefunden, erstelle neue!');
    return false;
  }

  
  /**
   * check if first and second User are part of Participants 
   * @returns 
   */
  participantExist(participants: Participants, firstUser: User, secondUser: User) {
    return (participants.first.uid === firstUser.uid && participants.second.uid === secondUser.uid) ||
      (participants.first.uid === secondUser.uid && participants.second.uid === firstUser.uid)
  }

  /**
   * Creates a new Conversatin between first and second User
   * @param firstUser 
   * @param secondUser 
   */
  async createNewConversation(firstUser: User, secondUser: User) {
    this.fireService.currentConversation = new Conversation();
    this.fireService.currentConversation.participants.first = firstUser;
    this.fireService.currentConversation.participants.second = secondUser;
    await this.fireService.addConversation(this.fireService.currentConversation);
  }
}
