import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user.class';
import { Channel } from '../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { UserService } from '../../../services/user.service';
import { Message } from '../../../models/message.class';

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

  @Input() currentRecipient: User | Channel = new Channel; // Empfänger der Nachricht 
  content: string = ''; // content of the message
  data: any[] = []; // message data, e.g. photos


  ngOnInit(): void {
    this.copyRecipient();
    console.log(this.currentRecipient);
    
  }

  /**
   * create of copy of User or Channel
   */
  copyRecipient() {
    if (this.currentRecipient instanceof User) {
      this.currentRecipient = new User(this.currentRecipient);
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
    await this.userService.fireService.updateChannel(this.currentRecipient);
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
        thread: [],
        data: [],
        reactions: []
    });
}

  /**
   * code for sending direct message
   */
  handleDirectMessage() {

  }

  /**
   * handle differtent recipients (channel or direct message)
   */
  saveNewMessage() {
    if (this.currentRecipient instanceof Channel) {
      this.handleChannelMessage();
    } else {
      this.handleDirectMessage();
    }
  }

}
