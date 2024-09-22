import { inject, Pipe, PipeTransform } from '@angular/core';
import { Message } from '../models/message.class';
import { FirestoreService } from '../services/firestore.service';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'filterMessage',
  standalone: true
})
export class FilterMessagePipe implements PipeTransform {
  fireService = inject(FirestoreService);
  channelService = inject(ChannelService);
  userService = inject(UserService);

  /**
   * 
   * @param messages 
   * @returns only the messages for which the user has permission
   */
  transform(messages: Message[]): Message[] {
    return messages.filter(message => {
      if (message.sender === this.userService.getCurrentUser().uid) {
        return true;
      }
      if (this.isUserInConversation(message)) {
        return true;
      }
      if (this.isUserInChannelMessage(message)) {
        return true;
      }  
        return false;
    })
  }

  isUserInConversation(message: Message) {
    for (const conversation of this.fireService.conversations) {
      if (conversation.messages.some(m => m.id === message.id)) {
        if (conversation.participants.first === this.userService.getCurrentUser().uid || conversation.participants.second === this.userService.getCurrentUser().uid) {
          return true;
        }
      }
    }
    return false;
  }

  isUserInChannelMessage(message: Message) {
    for (const channel of this.fireService.channels) {
      if (channel.messages.some(m => m.id === message.id)) {
        if (this.channelService.isUserInChannel(this.userService.getCurrentUser(), channel)) {
          return true;
        }
      }
    }
    return false;
  }

}
