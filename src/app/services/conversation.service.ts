/**
 * This Service File is for handling everything about conversations
 */

import { ElementRef, inject, Injectable } from '@angular/core';
import { UiService } from './ui.service';
import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';
import { Conversation, Participants } from '../models/conversation.class';
import { BreakpointObserverService } from './breakpoint-observer.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  fireService = inject(FirestoreService);
  uiService = inject(UiService);
  userService = inject(UserService);
  observerService = inject(BreakpointObserverService);


  scrolledToBottomOnStart = false;

  constructor() { }


  scrollAtStart(container: ElementRef) {
    if (this.fireService.currentChannel.messages.length > 0 && !this.scrolledToBottomOnStart) {
      this.scrollToBottom(container);
      this.scrolledToBottomOnStart = true;
    }
  }

  scrollToBottom(container: ElementRef): void {
    try {
      container.nativeElement.scroll({
        top: container.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.log('Could not scroll to bottom');
    }
  }

  /**
   * change main content to 'directMessage'
   * and set the Conversation between the users,
   * 
   * @param secondUser is the User you want to chat with
   */
  openConversation(secondUserUid: string) {
    this.scrolledToBottomOnStart = false;
    this.setCurrentConversation(secondUserUid);
    this.showChatContent();
    this.uiService.hightlightUserChat(this.userService.getUserData(secondUserUid));
    this.uiService.channelChatNotActive();
  }

  showChatContent() {
    if (this.observerService.isMobile) {
      this.uiService.openChatMobile('directMessage');
    } else {
      this.uiService.changeMainContent('directMessage');
      this.uiService.showThread = false;
    }
  }

  /**
   * if the conversation between logged in User and secondUser already exists,
   * it opens the conversation
   * if not, it creates a new Conversation and save it in firebase
   * 
   * @param secondUser is the User you want to chat with
   */
  async setCurrentConversation(secondUserUid: string) {
    let firstUserUid = this.userService.getCurrentUser().uid;
    let conversation = this.findConversation(firstUserUid, secondUserUid);
    if (conversation) {
      this.fireService.currentConversation = new Conversation(conversation);
    } else {
      await this.createNewConversation(firstUserUid, secondUserUid);
    }
    this.fireService.getMessagesPerDayForConversation();
  }

  /**
   * 
   * @param secondUser is the User you want do chat with
   * @returns false if the conversations do not exist, or
   * returns the conversation
   */
  findConversation(firstUserUid: string, secondUserUid: string): Conversation | false {
    for (let i = 0; i < this.fireService.conversations.length; i++) {
      const conversation = this.fireService.conversations[i];
      const participants = conversation.participants;
      if (this.participantExist(participants, firstUserUid, secondUserUid)) {
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
  participantExist(participants: Participants, firstUserUid: string, secondUserUid: string) {
    return (participants.first === firstUserUid && participants.second === secondUserUid) ||
      (participants.first === secondUserUid && participants.second === firstUserUid)
  }

  /**
   * Creates a new Conversatin between first and second User
   * @param firstUser 
   * @param secondUser 
   */
  async createNewConversation(firstUserUid: string, secondUserUid: string) {
    this.fireService.currentConversation = new Conversation();
    this.fireService.currentConversation.participants.first = firstUserUid;
    this.fireService.currentConversation.participants.second = secondUserUid;
    await this.fireService.addConversation(this.fireService.currentConversation);
  }
}
