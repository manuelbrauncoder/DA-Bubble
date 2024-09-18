import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';
import { UserService } from '../../../services/user.service';
import { PopupAddUserComponent } from "../popup-add-user/popup-add-user.component";
import { PopupEditChannelComponent } from "../popup-edit-channel/popup-edit-channel.component";
import { PopupChannelUsersComponent } from "../popup-channel-users/popup-channel-users.component";
import { SendMessageComponent } from "../send-message/send-message.component";
import { SingleMessageComponent } from "../single-message/single-message.component";
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { fadeIn } from "../../../shared/animations";
import { FormatDateForListPipe } from '../../../pipes/format-date-for-list.pipe';
import { CommonModule } from '@angular/common';
import { BreakpointObserverService } from '../../../services/breakpoint-observer.service';
import { DateDividerComponent } from "../single-message/date-divider/date-divider.component";

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  animations: [fadeIn],
  imports: [PopupAddUserComponent, PopupEditChannelComponent, PopupChannelUsersComponent, SendMessageComponent, SingleMessageComponent, FormatDateForListPipe, CommonModule, DateDividerComponent],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent implements AfterViewChecked {
  channelService = inject(ChannelService);
  uiService = inject(UiService);
  userService = inject(UserService);
  authService = inject(FirebaseAuthService);
  observerService = inject(BreakpointObserverService);

  @ViewChild('channelMessages') scrollContainer!: ElementRef;
  

  ngAfterViewChecked(): void {
    this.channelService.scrollAtStart(this.scrollContainer);
  }

  getChannelCreator(){
    if (this.userService.getCurrentUser().uid === this.channelService.fireService.currentChannel.creator) {
      return 'Du hast';
    } else {
      return `${this.userService.getUserData(this.channelService.fireService.currentChannel.creator).username} hat`;
    }
  }

  getDate(){
    const today = new Date();
    const dateToday = today.toLocaleDateString();
    const channelTime = new Date(this.channelService.fireService.currentChannel.time);
    const channelDate = channelTime.toLocaleDateString();
    if (channelDate === dateToday) {
      return 'heute';
    } else {
      return `am ${channelDate}`;
    }
  }

 
  

  

  
  

  
}
