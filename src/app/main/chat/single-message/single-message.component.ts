import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../../models/message.class';
import { UiService } from '../../../services/ui.service';
import { FirestoreService } from '../../../services/firestore.service';
import { Thread } from '../../../models/thread.class ';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { BreakpointObserverService } from '../../../services/breakpoint-observer.service';
import { ThreadService } from '../../../services/thread.service';
import { ReactionBarComponent } from "./reaction-bar/reaction-bar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [CommonModule, ReactionBarComponent, FormsModule],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent implements OnInit {
  uiService = inject(UiService);
  fireService = inject(FirestoreService);
  userService = inject(UserService);
  observerService = inject(BreakpointObserverService);
  threadService = inject(ThreadService);

  @Input() currentMessage: Message = new Message();
  @Input() threadMessage: boolean = false;

  showMenuPopup = false;
  editMode = false;

  editContent = '';

  showEditContainer() {
    this.editMode = true;
    this.editContent = this.currentMessage.content;
    this.showMenuPopup = false;
  }

  cancelEditMode() {
    this.editContent = '';
    this.editMode = false;
  }

  async saveEditedMessage() {
    this.currentMessage.content = this.editContent; // update content from currentMessage
    await this.handleChannelMessage();
    await this.handleConversationMessage();
  }

  async handleChannelMessage() {
    const channel = this.fireService.currentChannel;  // current channel from fireService
    let messageIndex = 0; // index from message in channel
    for (let k = 0; k < channel.messages.length; k++) { // for loop über alle messages im channel
      const message = channel.messages[k];
      if (message.id === this.currentMessage.id) {  // wenn die id übereinstimmt
        messageIndex = channel.messages.findIndex(chMessage => chMessage.id === this.currentMessage.id);  // index der nachricht suchen
        channel.messages[messageIndex] = this.currentMessage; // nachricht im channel updaten
        await this.fireService.addChannel(channel); // channel in firebase updaten
        this.cancelEditMode();
        console.log('Message found:', message, 'in Channel:', channel);
        return; // mit return funktion abbrechen, heißt der rest wird nur ausgeführt wenn die Nachricht nicht gefunden wurde
      } else if (message.thread) { // wenn die message einen thread hat
        for (let j = 0; j < message.thread.messages.length; j++) { // for loop über die messages im thread
          const threadMessage = message.thread.messages[j]; 
          if (threadMessage.id === this.currentMessage.id) {  // wenn thread message id und currentMessage id übereinstimmen
            const threadMessageIndex = message.thread.messages.findIndex(m => m.id === threadMessage.id); // index suchen
            message.thread.messages[threadMessageIndex] = this.currentMessage;  // message mit index updaten
            await this.fireService.addChannel(channel); // channel in firebase updaten
            this.cancelEditMode();
            console.log('message found:', threadMessage, 'in thread:', message.thread, 'in channel:', channel);
            return;
          }
        }
      }
    }
  }

  async handleConversationMessage() {
    const conversation = this.fireService.currentConversation;
    let messageIndex = 0;
    for (let k = 0; k < conversation.messages.length; k++) {
      const message = conversation.messages[k];
      if (message.id === this.currentMessage.id) {
        messageIndex = conversation.messages.findIndex(conMess => conMess.id === this.currentMessage.id);
        conversation.messages[messageIndex] = this.currentMessage;
        await this.fireService.addConversation(conversation);
        this.cancelEditMode();
        console.log('Message found:', message, 'in Conversation:', conversation);
        return;
      } else if (message.thread) {
        for (let k = 0; k < message.thread.messages.length; k++) {
          const threadMessage = message.thread.messages[k];
          if (threadMessage.id === this.currentMessage.id) {
            const threadMessageIndex = message.thread.messages.findIndex(m => m.id === this.currentMessage.id);
            message.thread.messages[threadMessageIndex] = this.currentMessage;
            await this.fireService.addConversation(conversation);
            this.cancelEditMode();
            console.log('message found:', threadMessage, 'in thread:', message.thread, 'in conversation:', conversation);
            return;
          }
        }
      }
    }
  }

  toggleMenuPopup() {
    this.showMenuPopup = !this.showMenuPopup;
  }

  months = [
    "Januar", "Februar", "März", "April",
    "Mai", "Juni", "Juli", "August",
    "September", "Oktober", "November", "Dezember"
  ];

  weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }

  formatAnswerCount() {
    return this.currentMessage.thread?.messages.length === 1 ? 'Antwort' : 'Antworten';
  }

  getFormattedDate() {
    const date = new Date(this.currentMessage.time);
    const weekday = this.weekdays[date.getDay()];
    const month = this.months[(date.getMonth())];
    const day = date.getDate()
    return `${weekday}, ${day} ${month}`;
  }

  /**
   * 
   * @param timeStamp unix timestamp
   * @returns formatted time 
   */
  getFormattedTime(timeStamp: number) {
    const date = new Date(timeStamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} Uhr`;
    return formattedTime;
  }

  /**
   * 
   * @returns formatted time of last answer
   */
  getTimeOfLastAnswer() {
    if (this.currentMessage.thread) {
      if (this.currentMessage.thread.messages.length > 0) {
        return this.getFormattedTime(this.currentMessage.thread.messages[this.currentMessage.thread.messages.length - 1].time);
      }
    }
    return;
  }



  /**
   * 
   * @returns true if the messages has answers,
   * false if it has no ansers
   */
  messageHasAnswers() {
    if (this.currentMessage.thread) {
      if (this.currentMessage.thread.messages.length > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * show tread window with new or existing thread
   * set curent message in fire service with current message from input
   */
  answer() {
    this.threadService.scrolledToBottomOnStart = false;
    this.openThreadWindow();
    if (this.uiService.mainContent === 'directMessage') {
      this.setCurrentThreadForDm();
      this.fireService.currentMessage = new Message(this.currentMessage);
    } else if (this.uiService.mainContent === 'channelChat') {
      this.setCurrentThreadForChannel();
      this.fireService.currentMessage = new Message(this.currentMessage);
    } else {
      console.log('no option choosed');

    }

  }

  openThreadWindow() {
    if (this.observerService.isMobile) {
      this.uiService.openThreadMobile();
    } else {
      this.uiService.showThread = true;
    }
  }

  /**
   * if the message already has a thread,
   * set this thread as currentThread.
   * if not, create a new Thread and set it
   * as currentThread and save it in firebase
   */
  async setCurrentThreadForChannel() {
    if (this.currentMessage.thread) {
      if (this.currentMessage.thread.messages.length > 0) {
        console.log('Thread gefunden');
        this.fireService.currentThread = new Thread(this.currentMessage.thread)
        this.fireService.getMessagesPerDayForThread();
      } else {
        console.log('Keinen Thread gefunden, erstelle neuen');
        this.fireService.currentThread = this.createThread();
        this.currentMessage.thread = this.fireService.currentThread;
        await this.saveUpdatedChannel();
        this.fireService.getMessagesPerDayForThread();
      }
    }
  }


  /**
   * if the message already has a thread,
   * set this thread as currentThread.
   * if not, create a new Thread and set it
   * as currentThread and save it in firebase
   */
  async setCurrentThreadForDm() {
    if (this.currentMessage.thread) {
      if (this.currentMessage.thread.messages.length > 0) {
        console.log('Thread gefunden');
        this.fireService.currentThread = new Thread(this.currentMessage.thread)
        this.fireService.getMessagesPerDayForThread();
      } else {
        console.log('Keinen Thread gefunden, erstelle neuen');
        this.fireService.currentThread = this.createThread();
        this.currentMessage.thread = this.fireService.currentThread;
        await this.saveUpdatedConversation();
        this.fireService.getMessagesPerDayForThread();
      }
    }
  }

  /**
   * Create a new thread with currentMessage as root message
   */
  createThread(): Thread {
    return new Thread({
      id: '',
      rootMessage: new Message(this.currentMessage),
      messages: []
    })
  }

  /**
   * set updatet message with thread in conversation
   * save updated conversatin in firebase
   */
  async saveUpdatedConversation() {
    const currentMessageId = this.currentMessage.id;
    const updateId = this.fireService.currentConversation.messages.findIndex(message => message.id === currentMessageId);
    this.fireService.currentConversation.messages[updateId] = this.currentMessage;
    await this.fireService.addConversation(this.fireService.currentConversation);
  }

  async saveUpdatedChannel() {
    const currentMessageId = this.currentMessage.id;
    const updateId = this.fireService.currentChannel.messages.findIndex(message => message.id === currentMessageId);
    this.fireService.currentChannel.messages[updateId] = this.currentMessage;
    await this.fireService.addChannel(this.fireService.currentChannel);
  }
}
