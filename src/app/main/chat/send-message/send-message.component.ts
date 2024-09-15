import { Component, inject, Input, OnInit } from '@angular/core';
import { Channel } from '../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { UserService } from '../../../services/user.service';
import { Message } from '../../../models/message.class';
import { Conversation } from '../../../models/conversation.class';
import { Thread } from '../../../models/thread.class ';
import { UiService } from '../../../services/ui.service';
import { ChannelService } from '../../../services/channel.service';
import { ConversationService } from '../../../services/conversation.service';
import { ThreadService } from '../../../services/thread.service';
import { PopupTaggableUsersComponent } from '../popup-taggable-users/popup-taggable-users.component';
import { fadeIn } from '../../../shared/animations';
import { FireStorageService } from '../../../services/fire-storage.service';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupTaggableUsersComponent],
  animations: [fadeIn],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss'
})
export class SendMessageComponent implements OnInit {
  authService = inject(FirebaseAuthService);
  userService = inject(UserService);
  storageService = inject(FireStorageService);
  uiService = inject(UiService);
  channelService = inject(ChannelService);
  conversationService = inject(ConversationService);
  threadService = inject(ThreadService);

  @Input() currentRecipient: Conversation | Channel = new Channel; // Empfänger der Nachricht
  @Input() threadMessage = false;
  @Input() newMessage = false;
  @Input() newPlaceholder = '';
  @Input() userUid = '';
  @Input() disableInput = false;

  content: string = ''; // content of the message
  data: any[] = []; // message data, e.g. photos
  selectedFiles: File[] = [];
  filePreviews: string[] = [];

  ngOnInit(): void {
    this.copyRecipient();
  }

  isBtnDisabled(){
    return this.disableInput || this.content.length < 2;
  }

  /**
   * 
   * @returns different strings with channel name or user name
   */
  getPlaceholderText() {
    if (this.newMessage) {
      return this.newPlaceholder;
    } else if (this.currentRecipient instanceof Conversation) {
      return `Nachricht an ${this.conversationService.getConversationPartner().username}`;
    } else {
      return `Nachricht an # ${this.currentRecipient.name}`;
    }
  }

  showTaggableUsers() {
    this.uiService.toggleTaggableUsersPopup();
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
      this.createThreadInChannelMessage(message);
    }
    await this.userService.fireService.addChannel(this.userService.fireService.currentChannel);

  }

  createThreadInChannelMessage(message: Message) {
    console.log('thread channel message!');
    this.userService.fireService.currentThread.messages.push(message);
    const messageIndex = this.findChannelMessageToUpdate();
    this.userService.fireService.currentChannel.messages[messageIndex].thread = new Thread(this.userService.fireService.currentThread);
  }

  /**
   * set currentRecipient as new Conversation
   * create message object
   * push message to messages array in Conversation
   * update Conversation in firestore
   */
  async handleDirectMessage() {
    this.currentRecipient = new Conversation(this.currentRecipient as Conversation);
    const message = this.createMessage(this.content);
    if (!this.threadMessage) {
      this.currentRecipient.messages.push(message);
    } else {
      this.createThreadInConversationMessage(message);
    }
    await this.userService.fireService.addConversation(this.userService.fireService.currentConversation);

  }

  createThreadInConversationMessage(message: Message) {
    this.userService.fireService.currentThread.messages.push(message);
    const messageIndex = this.findConversationMessageToUpdate();
    this.userService.fireService.currentConversation.messages[messageIndex].thread = new Thread(this.userService.fireService.currentThread);
  }

  findChannelMessageToUpdate() {
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
      sender: this.userService.getCurrentUser().uid,
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
    if (this.selectedFiles.length > 0) {
      const fileUrls = await this.storageService.uploadFiles(this.selectedFiles);
      this.data = fileUrls;
    }
  
    const message = this.createMessage(this.content);
    message.data = this.data; 
  
    if (this.currentRecipient instanceof Channel) {
      await this.handleChannelMessage();
      this.channelService.scrolledToBottomOnStart = false;
    } else {
      await this.handleDirectMessage();
      this.conversationService.scrolledToBottomOnStart = false;
    }
  
    this.userService.fireService.getMessagesPerDayForThread();
    this.content = '';
    this.data = [];
    this.filePreviews = [];
    this.selectedFiles = []; 
    this.threadService.scrolledToBottomOnStart = false;
    this.redirectToChat();
  }

  redirectToChat() {
    if (!this.newMessage) {
      return;
    } else {
      if (this.currentRecipient instanceof Conversation) {
        this.conversationService.openConversation(this.userUid);
      } else {
        this.channelService.toggleActiveChannel(this.currentRecipient);
      }
    }
  }

  getFileName(preview: string): string {
    return this.storageService.extractFileName(preview);
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.filePreviews = []; 

      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

}
