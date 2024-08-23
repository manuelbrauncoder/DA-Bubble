import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  fireService = inject(FirestoreService);

  constructor() { }

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
