import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../../models/message.class';
import { UiService } from '../../../services/ui.service';
import { FirestoreService } from '../../../services/firestore.service';
import { Thread } from '../../../models/thread.class ';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent implements OnInit {
  uiService = inject(UiService);
  fireService = inject(FirestoreService);
  @Input() currentMessage: Message = new Message();
  @Input() threadMessage: boolean = false;

  months = [
    "Januar", "Februar", "März", "April",
    "Mai", "Juni", "Juli", "August",
    "September", "Oktober", "November", "Dezember"
  ];

  weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }

  getFormattedDate() {
    const date = new Date(this.currentMessage.time);
    const weekday = this.weekdays[date.getDay()];
    const month = this.months[(date.getMonth())];
    const day = date.getDate()
    return `${weekday}, ${day} ${month}`;
  }

  getFormattedTime() {
    const date = new Date(this.currentMessage.time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} Uhr`;
    return formattedTime;
  }

  /**
   * show tread window with new or existing thread
   * set curent message in fire service with current message from input
   */
  answer() {
    this.uiService.showThread = true;
    if (this.uiService.mainContent === 'directMessage') {
      this.setCurrentThreadForDm();
      this.fireService.currentMessage = new Message(this.currentMessage);
      console.log(this.fireService.currentThread);
    } else if (this.uiService.mainContent === 'channelChat') {
      this.setCurrentThreadForChannel();
      this.fireService.currentMessage = new Message(this.currentMessage);
      console.log(this.fireService.currentChannel);

    } else {
      console.log('no option choosed');

    }

  }

  setCurrentThreadForChannel() {
    if (this.currentMessage.thread) {
      if (this.currentMessage.thread.messages.length > 0) {
        console.log('Thread gefunden');
        this.fireService.currentThread = new Thread(this.currentMessage.thread)
      } else {
        console.log('Keinen Thread gefunden, erstelle neuen');
        this.fireService.currentThread = this.createThread();
        this.currentMessage.thread = this.fireService.currentThread;
        this.saveUpdatedChannel();
      }
    }
  }


  /**
   * open thread window with existing thread,
   * or create a new thread and save in firebase
   */
  setCurrentThreadForDm() {
    if (this.currentMessage.thread) {
      if (this.currentMessage.thread.messages.length > 0) {
        console.log('Thread gefunden');
        this.fireService.currentThread = new Thread(this.currentMessage.thread)
      } else {
        console.log('Keinen Thread gefunden, erstelle neuen');
        this.fireService.currentThread = this.createThread();
        this.currentMessage.thread = this.fireService.currentThread;
        this.saveUpdatedConversation();
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
  saveUpdatedConversation() {
    const currentMessageId = this.currentMessage.id;
    const updateId = this.fireService.currentConversation.messages.findIndex(message => message.id === currentMessageId);
    this.fireService.currentConversation.messages[updateId] = this.currentMessage;
    this.fireService.addConversation(this.fireService.currentConversation);
  }

  saveUpdatedChannel() {
    const currentMessageId = this.currentMessage.id;
    const updateId = this.fireService.currentChannel.messages.findIndex(message => message.id === currentMessageId);
    this.fireService.currentChannel.messages[updateId] = this.currentMessage;
    this.fireService.addChannel(this.fireService.currentChannel);
  }
}
