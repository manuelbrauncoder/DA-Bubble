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
import { ConversationService } from '../../services/conversation.service';
import { Conversation } from '../../models/conversation.class';

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
  conversationService = inject(ConversationService);

  channel: Channel = new Channel();

  searchInput = '';

  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  filteredMessages: Message[] = [];

  resetSearch() {
    this.searchInput = '';
    this.filteredUsers = [];
    this.filteredChannels = [];
    this.filteredMessages = [];
  }

  redirectToChannel(channel: Channel){
    this.channelService.toggleActiveChannel(channel);
    this.resetSearch();
  }

  redirectToConversation(secondUserUid: string){
    this.conversationService.openConversation(secondUserUid);
    this.resetSearch();
  }

  redirectToThread(){
    
  }

  redirectToMessage(message: Message){
   this.isMessageInChannel(message);  // search message in channel
   this.isMessageInConversation(message);   // search message in conersation
  }

  /**
   * loop over conversations and every message in conversation
   * @param message 
   */
  isMessageInConversation(message: Message) {
    this.fireService.conversations.forEach(conversation => {
      conversation.messages.forEach(m => {
        this.searchMessageInConversation(m, message.id, conversation);
      })
    })
  }

  /**
   * search messageId in thread.messages,
   * if not found, search in thread
   * @param message from array
   * @param messageId to find
   * @param conversation to search for messages
   */
  searchMessageInConversation(message: Message, messageIdToFind: string, conversation: Conversation) {
    const secondUid = this.userService.getCurrentUser().uid === conversation.participants.first ? conversation.participants.second : conversation.participants.first;
    if (message.id === messageIdToFind) {
      this.redirectToConversation(secondUid);
      console.log('Message is in Conversation');
      return;
    }
    if (message.thread) {
      const matchingThreadMessages = message.thread.messages.filter(tm => tm.id === messageIdToFind);
      if (matchingThreadMessages.length > 0) {
        this.redirectToConversation(secondUid);
        console.log('Message in Thread');
        return;
      }
    }
  }

  isMessageInChannel(message: Message){
    this.fireService.channels.forEach(channel => {
      channel.messages.forEach(m => {
        this.searchMessageInChannel(m, message.id, channel);
      })
    })
  }

  searchMessageInChannel(message: Message, messageIdToFind: string, channel: Channel) {
    if (message.id === messageIdToFind) {
      this.redirectToChannel(channel);
      console.log('Message is in Channel');
      return;
    }
    if (message.thread) {
      const matchingThreadMessages = message.thread.messages.filter(tm => tm.id === messageIdToFind);
      if (matchingThreadMessages.length > 0) {
        this.redirectToChannel(channel);
        console.log('Message in thread');
        return;
      }
    }
  }



  // for search function

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
