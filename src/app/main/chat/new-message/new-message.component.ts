import { Component, inject } from '@angular/core';
import { SendMessageComponent } from "../send-message/send-message.component";
import { FirestoreService } from '../../../services/firestore.service';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../models/channel.class';
import { Conversation } from '../../../models/conversation.class';
import { ConversationService } from '../../../services/conversation.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [SendMessageComponent, FormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  fireService = inject(FirestoreService);
  conversationService = inject(ConversationService);
  userService = inject(UserService);

  searchInput = '';
  filteredResults: string[] = [];

  placeholderForChild = 'Starte eine neue Nachricht';
  recipientForChild: Channel | Conversation  =  new Channel;
  userUid = '';
  disableInputChild = true;

  search() {
    if (this.searchInput.trim()) {
      this.resetSearch();
      const trimmedInput = this.searchInput.trim().toLowerCase();
      if (trimmedInput.startsWith('#')) {
        this.filteredResults = this.fireService.channels
          .filter(channel => channel.name.toLowerCase().includes(trimmedInput.substring(1)))
          .map(channel => channel.name);
      } else if (trimmedInput.startsWith('@')) {
        this.filteredResults = this.fireService.users
          .filter(user => user.username.toLowerCase().includes(trimmedInput.substring(1)) || user.email.toLowerCase().includes(trimmedInput.substring(1)))
          .map(user => user.username);
      } else {
        const filteredUser = this.fireService.users
          .filter(user => user.username.toLowerCase().includes(trimmedInput) || user.email.toLowerCase().includes(trimmedInput))
          .map(user => user.username)
        const filteredChannels = this.fireService.channels
          .filter(channel => channel.name.toLowerCase().includes(trimmedInput))
          .map(channel => channel.name);
        this.filteredResults = [...new Set([...filteredUser, ...filteredChannels])]
      }
    } else {
      this.resetSearch();
      this.disableInputChild = true;
    }
  }

  resetSearch() {
    this.filteredResults = [];
    this.placeholderForChild = 'Starte eine neue Nachricht';
  }

  completeInput(result: string) {
    this.searchInput = result;
    this.filteredResults = [];
    this.createNewPlaceholder(result);
    this.getRecipient(result);
    this.disableInputChild = false;
  }

  createNewPlaceholder(name: string) {
    this.placeholderForChild = `Nachricht an ${name}`;
  }

  async getRecipient(result: string) {
    for (let channel of this.fireService.channels) {
      if (channel.name.trim().toLowerCase() === result.trim().toLowerCase()) {
        this.recipientForChild = new Channel(channel);
        return;
      }
    }
    for (let user of this.fireService.users) {
      if (user.username.trim().toLowerCase() === result.trim().toLowerCase()) {
        await this.conversationService.setCurrentConversation(user.uid);
        this.userUid = user.uid;
        this.recipientForChild = this.fireService.currentConversation;
        return;
      }
    }
  }
}

