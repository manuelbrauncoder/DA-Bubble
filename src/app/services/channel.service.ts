import { inject, Injectable, ElementRef } from '@angular/core';
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

  scrolledToBottomOnStart = false;

  constructor() { }
  

  scrollAtStart(container: ElementRef) {
    if (this.fireService.currentChannel.messages.length > 0 && !this.scrolledToBottomOnStart) {
      this.scrollToBottom(container);
      this.scrolledToBottomOnStart = true;
    }
  }

  scrollToBottom(container: ElementRef): void {
    try {
      container.nativeElement.scroll({
        top: container.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.log('Could not scroll to bottom');
    }
  }

  /**
   * Check if a user exists in the channel
   * @param user you want to check
   * @param channel you want to know if user is in
   * @returns 
   */
  isUserInChannel(user: User, channel: Channel) {
    return channel.users.some(u => u === user.uid);
  }

  /**
   * This method toggles the active Channel
   * Call in Workspace-menu-component
   * @param activeChannel 
   */
  toggleActiveChannel(activeChannel: Channel, scrollToBottom: boolean) {
    this.uiService.userChatNotActive();
    this.fireService.channels.forEach((channel) => {
      if (activeChannel.name === channel.name) {
        channel.channelActive = true;
        this.fireService.currentChannel = new Channel(activeChannel);
        this.showChannelContent();
        this.fireService.getMessagesPerDay();
        scrollToBottom ? this.scrolledToBottomOnStart = false : true;
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
