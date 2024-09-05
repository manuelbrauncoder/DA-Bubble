import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Channel } from '../models/channel.class';
import { User } from '../models/user.class';
import { UiService } from './ui.service';
import { BreakpointObserverService } from './breakpoint-observer.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  fireService = inject(FirestoreService);
  uiService = inject(UiService);
  observerService = inject(BreakpointObserverService);

  constructor() { }

  /**
   * Check if a user exists in the channel
   * @param user you want to check
   * @param channel you want to know if user is in
   * @returns 
   */
  isUserInChannel(user: User, channel: Channel) {
    return channel.users.some(u => u.uid === user.uid);
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
        this.showChannelContent();
        this.fireService.getMessagesPerDay();
      } else {
        channel.channelActive = false;
      }
    })
  }

  showChannelContent() {
    if (this.observerService.isMobile) {
      this.uiService.openChatMobile('channelChat');
    } else {
      this.uiService.changeMainContent('channelChat');
      this.uiService.showThread = false;
    }
  }

}
