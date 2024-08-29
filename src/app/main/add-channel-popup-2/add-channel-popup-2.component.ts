import { Component, inject, Input, OnInit } from '@angular/core';
import { Channel } from '../../models/channel.class';
import { UiService } from '../../services/ui.service';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';

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
  userService = inject(UserService);
  channelService = inject(ChannelService);
  searchInput = '';

  selectedUsers: User[] = [];
  availableUsers: User[] = [];

  users: 'all' | 'certain' = 'all';

  ngOnInit(): void {
    this.newChannel = new Channel(this.currentChannel);
    this.availableUsers = [...this.userService.fireService.users];
  }

  /**
   * 
   * @returns all avalableUsers or a filtered Array
   */
  searchUsers() {
    if (!this.searchInput) {
      return this.availableUsers;
    } else {
      return this.availableUsers.filter((user) =>
        user.username.toLowerCase().includes(this.searchInput));
    }
  }

  /**
   * select user and remove it from availableUsers array
   * @param user 
   */
  selectUser(user: User) {
    this.selectedUsers.push(user);
    const index = this.availableUsers.findIndex(u => u.username === user.username);
    if (index !== -1) {
      this.availableUsers.splice(index, 1);
    }
  }

  /**
   * unselect user and push to availableUsers array
   * @param user 
   * @param index 
   */
  unselectUser(user: User, index: number) {
    this.availableUsers.push(user);
    this.selectedUsers.splice(index, 1);
  }

  /**
   * runs when form is submitted
   */
  async onSubmit() {
    if (this.users === 'all') {
      this.addAllUsersToChannel();
      await this.saveChannelAndClose();
    } else if (this.users === 'certain' && this.selectedUsers.length > 0) {
      this.newChannel.users = [...this.selectedUsers];
      await this.saveChannelAndClose()
    }
  }

  /**
   * save new channel in firebase and
   * close popups
   */
  async saveChannelAndClose() {
    await this.channelService.fireService.addChannel(this.newChannel);
    this.uiService.toggleAddChannelPopup();
    this.channelService.toggleActiveChannel(this.newChannel);
  }

  /**
   * add all users to channel.users
   */
  addAllUsersToChannel() {
    this.newChannel.users = [];
    this.channelService.fireService.users.forEach(user => {
      this.newChannel.users.push(user);
    })
  }

  /**
   * 
   * @returns true if 'all' or selected array lenght > 0
   */
  usersSelected() {
    if (this.selectedUsers.length > 0 || this.users === 'all') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * hide searchbar and select 'all'
   */
  chooseAllUsers() {
    this.users = 'all';
    this.uiService.channelPopup2Searchbar = false;
  }

  /**
   * show searchbar and select 'certain'
   */
  chooseCertainUsers() {
    this.users = 'certain';
    this.uiService.channelPopup2Searchbar = true;
  }
}
