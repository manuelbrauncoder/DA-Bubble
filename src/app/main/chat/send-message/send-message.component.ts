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

  @Input() currentRecipient: Conversation | Channel = new Channel; // Empfänger der Nachricht 
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
    this.currentRecipient.messages.push(message);
    await this.userService.fireService.addChannel(this.currentRecipient);
  }

  /**
   * code for sending direct message
   */
  async handleDirectMessage() {
    this.currentRecipient = new Conversation(this.currentRecipient as Conversation);
    const message = this.createMessage(this.content);
    this.currentRecipient.messages.push(message);
    await this.userService.fireService.addConversation(this.currentRecipient);
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
  saveNewMessage() {
    if (this.currentRecipient instanceof Channel) {
      this.handleChannelMessage();
      this.content = '';
    } else {
      this.handleDirectMessage();
      this.content = '';
    }
  }

}
