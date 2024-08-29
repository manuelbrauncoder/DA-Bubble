import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../models/channel.class';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-popup-edit-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup-edit-channel.component.html',
  styleUrl: './popup-edit-channel.component.scss'
})
export class PopupEditChannelComponent {
  channelService = inject(ChannelService);
  uiService = inject(UiService);
  userService = inject(UserService);

  nameInput = '';
  descriptionInput = '';

  updatedChannel: Channel = new Channel();

  showNameInput = false;
  showDescriptionInput = false;

  /**
   * Remove current User from Channel
   */
  leaveChannel(){
    let currentUser: User = this.userService.getCurrentUser();
    if (currentUser) {
     const userIndex = this.channelService.fireService.currentChannel.users.findIndex(u => u.uid === currentUser.uid);
      this.channelService.fireService.currentChannel.users.splice(userIndex, 1); 
      this.uiService.toggleEditChannelPopup();     
    }
  }

  toggleNameInput(){
    this.showNameInput = !this.showNameInput;
  }

  toggleDescriptionInput(){
    this.showDescriptionInput = !this.showDescriptionInput;
  }

  /**
   * Save new Channel name in firestore
   */
  async saveNewChannelName(){
    this.updatedChannel = new Channel(this.channelService.fireService.currentChannel);
    this.updatedChannel.name = this.nameInput;
    await this.channelService.fireService.addChannel(this.updatedChannel);
    this.channelService.toggleActiveChannel(this.updatedChannel);
    this.toggleNameInput();
  }

  /**
   * save new Channel description in firestore
   */
  async saveNewChannelDescription(){
    this.updatedChannel = new Channel(this.channelService.fireService.currentChannel);
    this.updatedChannel.description = this.descriptionInput;
    await this.channelService.fireService.addChannel(this.updatedChannel);
    this.channelService.toggleActiveChannel(this.updatedChannel);
    this.toggleDescriptionInput();
  }
}
