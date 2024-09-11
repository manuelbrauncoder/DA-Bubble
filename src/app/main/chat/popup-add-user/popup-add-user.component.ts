import { Component, inject, OnInit } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';
import { Channel } from '../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup-add-user.component.html',
  styleUrl: './popup-add-user.component.scss'
})
export class PopupAddUserComponent implements OnInit {
  channelService = inject(ChannelService);
  uiService = inject(UiService);
  userService = inject(UserService);

  updatedChannel: Channel = new Channel();

  searchInput = '';

  selectedUsers: string[] = [];
  availableUsers: string[] = [];

  /**
   * copy the current channel to updated channel
   * copy users from current channel to selected users array
   * push the available users in the array
   */
  ngOnInit(): void {
    this.updatedChannel = new Channel(this.channelService.fireService.currentChannel);
    this.selectedUsers = [...this.channelService.fireService.currentChannel.users];
    this.availableUsers = this.getAvailableUsers();
  }

  /**
   * Copy the selected users to the updated channel.users
   * save updated channel in firebase
   * set channel as current active channel
   * clear arrays and close popup
   */
  async onSubmit() {
    this.updatedChannel.users = [...this.selectedUsers];
    await this.channelService.fireService.addChannel(this.updatedChannel);
    this.channelService.toggleActiveChannel(this.updatedChannel);
    this.clearArrAndClosePopup();
  }

  clearArrAndClosePopup(){
    this.selectedUsers = [];
    this.availableUsers = [];
    this.uiService.toggleAddUserToChannelPopup();
  }


  /**
   * 
   * @returns all users, that are not in the selectedUsers array
   */
  getAvailableUsers() {
    let userIds: string[] = [];
    const users = this.channelService.fireService.users.filter(user => !this.selectedUsers.some(selUser => selUser === user.uid));
    users.forEach((user) => {
      userIds.push(user.uid);
    })
    return userIds;
  }

  /**
   * 
   * @returns all avalableUsers or a filtered Array
   */
  searchUsers() {
    if (!this.searchInput) {
      return this.availableUsers;
    } else {
      return this.availableUsers.filter((uid) =>
        this.userService.getUserData(uid).username.toLowerCase().includes(this.searchInput));
    }
  }

  /**
   * select user and remove it from availableUsers array
   * @param user 
   */
  selectUser(userUid: string) {
    this.selectedUsers.push(userUid);
    const index = this.availableUsers.findIndex(uid => uid === userUid);
    if (index !== -1) {
      this.availableUsers.splice(index, 1);
    }
  }

  /**
   * unselect user and push to availableUsers array
   * @param user 
   * @param index 
   */
  unselectUser(userUid: string, index: number) {
    this.availableUsers.push(userUid);
    this.selectedUsers.splice(index, 1);
  }
}
