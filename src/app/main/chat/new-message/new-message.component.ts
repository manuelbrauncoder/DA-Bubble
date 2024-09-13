import { Component, inject } from '@angular/core';
import { SendMessageComponent } from "../send-message/send-message.component";
import { FirestoreService } from '../../../services/firestore.service';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../models/channel.class';
import { Conversation } from '../../../models/conversation.class';
import { ConversationService } from '../../../services/conversation.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';

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
  filteredResults: (User | Channel)[] = [];

  placeholderForChild = 'Starte eine neue Nachricht';
  recipientForChild: Channel | Conversation = new Channel;
  userUid = '';
  isChildInputDisabled = true;

  isResultUser(result: User | Channel): result is User {
    return (result as User).avatar !== undefined;
  }

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
      .map(user => new User(user));
    const filteredChannels = this.fireService.channels
      .filter(channel => channel.name.toLowerCase().includes(searchTerm))
      .map(channel => new Channel(channel));
    this.filteredResults = [...filteredUser, ...filteredChannels];
  }

  searchUsers(input: string) {
    const searchTerm = input.substring(1);
    this.filteredResults = this.fireService.users
      .filter(user => user.username.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm))
      .map(user => new User(user));
  }

  setName(name: User | Channel) {
    if (name instanceof User) {
      return `@${name.username}`;
    } else {
      return `# ${name.name}`;
    }
  }

  isUserSearch(input: string): boolean {
    return input.startsWith('@');
  }

  searchChannels(input: string) {
    const searchTerm = input.substring(1);
    this.filteredResults = this.fireService.channels
      .filter(channel => channel.name.toLowerCase().includes(searchTerm))
      .map(channel => new Channel(channel));
  }

  isChannelSearch(input: string): boolean {
    return input.startsWith('#');
  }

  resetSearch() {
    this.filteredResults = [];
    this.placeholderForChild = 'Starte eine neue Nachricht';
  }

  completeInput(result: User | Channel) {
    if (result instanceof User) {
      this.setUserInput(result);
    } else {
      this.setChannelInput(result);
    }
    this.filteredResults = [];
    this.isChildInputDisabled = false;
  }

  setUserInput(result: User) {
    this.searchInput = result.username;
    this.createNewPlaceholder(result.username);
    this.setConversation(result);
  }

  setChannelInput(result: Channel) {
    this.searchInput = result.name;
    this.createNewPlaceholder(result.name);
    this.recipientForChild = new Channel(result);
  }

  createNewPlaceholder(name: string) {
    this.placeholderForChild = `Nachricht an ${name}`;
  }

  async setConversation(user: User) {
    for (let u of this.fireService.users) {
      if (user.uid === u.uid) {
        await this.conversationService.setCurrentConversation(u.uid);
        this.userUid = u.uid;
        this.recipientForChild = this.fireService.currentConversation;
      }
    }
  }
}

