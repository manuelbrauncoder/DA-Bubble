import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { Channel } from '../../models/channel.class';
import { UserService } from '../../services/user.service';
import { Message } from '../../models/message.class';
import { User } from '../../models/user.class';
import { ChannelService } from '../../services/channel.service';
import { FilterMessagePipe } from '../../pipes/filter-message.pipe';
import { TruncateStringPipe } from '../../pipes/truncate-string.pipe';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterMessagePipe, TruncateStringPipe],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @Input() showInWorkspaceMenu = false;
  @Input() placeholderText = 'Devspace durchsuchen';

  fireService = inject(FirestoreService);
  userService = inject(UserService);
  channelService = inject(ChannelService);


  searchInput = '';

  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  filteredMessages: Message[] = [];

  resetSearch() {
    this.filteredUsers = [];
    this.filteredChannels = [];
    this.filteredMessages = [];
  }

  search() {
    const searchTerm = this.searchInput.toLowerCase();
    if (searchTerm) {
      this.resetSearch();
      this.searchUsers(searchTerm);
      this.searchChannels(searchTerm);
      this.searchMessages(searchTerm);
    } else {
      this.resetSearch();
    }
  }

  searchMessages(searchTerm: string) {
    this.fireService.channels.forEach(channel => {
      channel.messages.forEach(message => {
        if (this.isMessageMatching(message, searchTerm)) {
          this.filteredMessages.push(message);
        }
      })
    })
    this.fireService.conversations.forEach(conversation => {
      conversation.messages.forEach(message => {
        if (this.isMessageMatching(message, searchTerm)) {
          this.filteredMessages.push(message);
        }
      })
    })
  }

  isMessageMatching(message: Message, searchTerm: string) {
    if (message.content.toLowerCase().includes(searchTerm)) {
      return true;
    }
    if (message.thread) {
      const matchingThreadMessages = message.thread.messages.filter(threadMessage =>
        threadMessage.content.toLowerCase().includes(searchTerm)
      );
      if (matchingThreadMessages.length > 0) {
        this.filteredMessages.push(...matchingThreadMessages);
      }
    }
    return false;
  }



  searchUsers(searchTerm: string) {
    this.filteredUsers = this.fireService.users
      .filter(user => user.username.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm))
      .map(user => new User(user));
  }

  searchChannels(searchTerm: string) {
    this.filteredChannels = this.fireService.channels
      .filter(channel => channel.name.toLowerCase().includes(searchTerm))
      .map(channel => new Channel(channel));
  }

  logAll() {
    console.log('Filtered Users:', this.filteredUsers);
    console.log('Filtered Channels:', this.filteredChannels);
    console.log('Filtered Messages:', this.filteredMessages);
  }
}
