import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Channel } from '../models/channel.class';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  fireService = inject(FirestoreService);

  constructor() { }

  /**
   * Check if a user exists in the channel
   * @param user you want to check
   * @param channel you want to know if user is in
   * @returns 
   */
  isUserInChannel(user: User, channel: Channel){
    return channel.users.some(u => u.uid === user.uid);
  }

  /**
   * set default channel
   * this method is only called once when the app launches
   */
  setDefaultChannel(){
   let firstInList = this.fireService.channels[0];
   this.toggleActiveChannel(firstInList);
  }

  /**
   * This method toggles the active Channel
   * Call in Workspace-menu-component
   * @param activeChannel 
   */
  toggleActiveChannel(activeChannel: Channel) {
    this.fireService.channels.forEach((channel) => {
      if (activeChannel.name === channel.name) {
        channel.channelActive = true;
        this.fireService.currentChannel = new Channel(activeChannel);
      } else {
        channel.channelActive = false;
      }
    })
  }

}
