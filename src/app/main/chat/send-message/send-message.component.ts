import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user.class';
import { Channel } from '../../../models/channel.class';
import { Message } from '../../../models/message.class';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { UserService } from '../../../services/user.service';

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

  @Input() currentRecipient: User | Channel = new Channel;
  content: string = '';

  ngOnInit(): void {
    this.copyRecipient();
  }

  

  async createMessage(){
    let message = {
      time: this.authService.getCurrentTimestamp(),
      sender: this.userService.getCurrentUser(),
      content: this.content,
      data: [],
      reactions: []
    }

    this.currentRecipient = new Channel(this.currentRecipient);
    this.currentRecipient.messages.push(message);

    // console.log(message);
    // console.log(this.currentRecipient);
    
    
    this.userService.fireService.updateChannel(this.currentRecipient);
  
  }


  /**
   * create of copy of User or Channel
   */
  copyRecipient(){
    if (this.currentRecipient instanceof User) {
      this.currentRecipient = new User(this.currentRecipient);
    } else {
      this.currentRecipient = new Channel(this.currentRecipient);
    }
  }

  setRecipient(){
    if (this.currentRecipient instanceof User) {
      return User;
    } else {
      return Channel;
    }
  }

  
}
