import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../models/channel.class';

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

  nameInput = '';
  descriptionInput = '';

  updatedChannel: Channel = new Channel();

  showNameInput = false;
  showDescriptionInput = false;

  toggleNameInput(){
    this.showNameInput = !this.showNameInput;
  }

  toggleDescriptionInput(){
    this.showDescriptionInput = !this.showDescriptionInput;
  }

  async saveNewChannelName(){
    this.updatedChannel = new Channel(this.channelService.fireService.currentChannel);
    this.updatedChannel.name = this.nameInput;
    await this.channelService.fireService.updateChannel(this.updatedChannel);
    this.channelService.toggleActiveChannel(this.updatedChannel);
    this.toggleNameInput();
  }

  async saveNewChannelDescription(){
    this.updatedChannel = new Channel(this.channelService.fireService.currentChannel);
    this.updatedChannel.description = this.descriptionInput;
    await this.channelService.fireService.updateChannel(this.updatedChannel);
    this.channelService.toggleActiveChannel(this.updatedChannel);
    this.toggleDescriptionInput();
  }
}
