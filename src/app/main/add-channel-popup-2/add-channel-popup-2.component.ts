import { Component, inject, Input, OnInit } from '@angular/core';
import { Channel } from '../../models/channel.class';
import { UiService } from '../../services/ui.service';
import { User } from '../../models/user.class';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-add-channel-popup-2',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-channel-popup-2.component.html',
  styleUrl: './add-channel-popup-2.component.scss'
})
export class AddChannelPopup2Component implements OnInit {
  @Input() currentChannel = new Channel();
  newChannel = new Channel();
  uiService = inject(UiService);
  channelService = inject(ChannelService);

  users: 'all' | 'certain' = 'all';

  ngOnInit(): void {
    this.newChannel = new Channel(this.currentChannel);
  }

  async onSubmit(){
    if (this.usersSelected()) {
      this.addAllUsersToChannel();
      await this.channelService.fireService.addChannel(this.newChannel);
      this.uiService.toggleAddChannelPopup();
      this.channelService.toggleActiveChannel(this.newChannel);
    }
  }

  addAllUsersToChannel(){
    this.newChannel.users = [];
    this.channelService.fireService.users.forEach(user => {
      this.newChannel.users.push(user);
    })
  }

  /**
   * 
   * @returns true if 'all' or selected array lenght > 0
   */
  usersSelected(){
    if (this.users === 'all' || this.newChannel.users.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * hide searchbar and select 'all'
   */
  chooseAllUsers(){
    this.users = 'all';
    this.uiService.channelPopup2Searchbar = false;
  }

  /**
   * show searchbar and select 'certain'
   */
  chooseCertainUsers(){
    this.users = 'certain';
    this.uiService.channelPopup2Searchbar = true;
  }
}
