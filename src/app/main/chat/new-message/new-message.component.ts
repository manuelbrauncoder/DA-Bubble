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
  recipientForChild: Channel | Conversation = new Channel;
  userUid = '';
  isChildInputDisabled = true;

  /**
   * handle different kinds of searches
   */
  search() {
    const trimmedInput = this.searchInput.trim().toLowerCase();
    if (this.searchInput.trim()) {
      this.resetSearch();
      if (this.isChannelSearch(trimmedInput)) {
        this.searchChannels(trimmedInput);
      } else if (this.isUserSearch(trimmedInput)) {
        this.searchUsers(trimmedInput);
      } else {
        this.searchAll(trimmedInput);
      }
    } else {
      this.resetSearch();
      this.isChildInputDisabled = true;
    }
  }

  /**
   * search for channel names, user names and user emails
   * @param searchTerm from input field
   */
  searchAll(searchTerm: string) {
    const filteredUser = this.fireService.users
      .filter(user => user.username.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm))
      .map(user => user.username)
    const filteredChannels = this.fireService.channels
      .filter(channel => channel.name.toLowerCase().includes(searchTerm))
      .map(channel => channel.name);
    this.filteredResults = [...new Set([...filteredUser, ...filteredChannels])];
  }

  searchUsers(input: string) {
    const searchTerm = input.substring(1);
    this.filteredResults = this.fireService.users
      .filter(user => user.username.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm))
      .map(user => user.username);
  }

  isUserSearch(input: string): boolean {
    return input.startsWith('@');
  }

  searchChannels(input: string) {
    const searchTerm = input.substring(1);
    this.filteredResults = this.fireService.channels
      .filter(channel => channel.name.toLowerCase().includes(searchTerm))
      .map(channel => channel.name);
  }

  isChannelSearch(input: string): boolean {
    return input.startsWith('#');
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
    this.isChildInputDisabled = false;
  }

  createNewPlaceholder(name: string) {
    this.placeholderForChild = `Nachricht an ${name}`;
  }

  /**
   * search in channels for the channel name, break if found
   * then search in conversations for conversation between result (user) and current user
   * @param result - the result from the search (username or channelname)
   * @returns just stop the method if channel or conversation found
   */
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

