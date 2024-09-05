import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user.class';
import { Channel } from '../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { UserService } from '../../../services/user.service';
import { Message } from '../../../models/message.class';
import { Conversation } from '../../../models/conversation.class';
import { Thread } from '../../../models/thread.class ';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss'
})
export class SendMessageComponent implements OnInit {
  authService = inject(FirebaseAuthService);
  userService = inject(UserService);
  uiService = inject(UiService);

  @Input() currentRecipient: Conversation | Channel = new Channel; // Empfänger der Nachricht
  @Input() threadMessage = false;

  content: string = ''; // content of the message
  data: any[] = []; // message data, e.g. photos


  ngOnInit(): void {
    this.copyRecipient();
  }

  /**
   * create of copy of User or Channel
   */
  copyRecipient() {
    if (this.currentRecipient instanceof Conversation) {
      this.currentRecipient = new Conversation(this.currentRecipient);
    } else {
      this.currentRecipient = new Channel(this.currentRecipient);
    }
  }

  /**
   * set currentRecipient as new Channel
   * create message object
   * push message to messages array in channel
   * update channel in firestore
   */
  async handleChannelMessage() {
    this.currentRecipient = new Channel(this.currentRecipient as Channel);
    const message = this.createMessage(this.content);
    if (!this.threadMessage) {
      this.currentRecipient.messages.push(message);
    } else {
      console.log('thread channel message!');
      this.userService.fireService.currentThread.messages.push(message);
      console.log(this.userService.fireService.currentThread);
      const messageIndex = this.findChannelMessageToUpdate();
      this.userService.fireService.currentChannel.messages[messageIndex].thread = new Thread(this.userService.fireService.currentThread);
      console.log(this.userService.fireService.currentChannel);
    }
    await this.userService.fireService.addChannel(this.userService.fireService.currentChannel);

  }

  /**
   * 
   */
  async handleDirectMessage() {
    this.currentRecipient = new Conversation(this.currentRecipient as Conversation);
    const message = this.createMessage(this.content);
    if (!this.threadMessage) {
      this.currentRecipient.messages.push(message);
    } else {
      this.userService.fireService.currentThread.messages.push(message);
      console.log(this.userService.fireService.currentThread);
      const messageIndex = this.findConversationMessageToUpdate();
      this.userService.fireService.currentConversation.messages[messageIndex].thread = new Thread(this.userService.fireService.currentThread);
      console.log(this.userService.fireService.currentConversation);
    }
    await this.userService.fireService.addConversation(this.userService.fireService.currentConversation);

  }

  findChannelMessageToUpdate(){
    return this.userService.fireService.currentChannel.messages.findIndex(message => message.id === this.userService.fireService.currentThread.rootMessage.id);
  }

  findConversationMessageToUpdate() {
    return this.userService.fireService.currentConversation.messages.findIndex(message => message.id === this.userService.fireService.currentThread.rootMessage.id);
  }

  /**
   * 
   * @param content from the message
   * @returns a Message Object
   */
  createMessage(content: string): Message {
    return new Message({
      time: this.authService.getCurrentTimestamp(),
      sender: this.userService.getCurrentUser(),
      content: content,
      thread: new Thread,
      data: [],
      reactions: []
    });
  }



  /**
   * handle differtent recipients (channel or direct message)
   */
  async saveNewMessage() {
    if (this.currentRecipient instanceof Channel) {
      await this.handleChannelMessage();
      this.userService.fireService.getMessagesPerDayForThread();
      this.content = '';
    } else {
      await this.handleDirectMessage();
      this.userService.fireService.getMessagesPerDayForThread();
      this.content = '';
    }
  }

}
