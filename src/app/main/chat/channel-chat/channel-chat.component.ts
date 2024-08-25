import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';
import { UserService } from '../../../services/user.service';
import { PopupAddUserComponent } from "../popup-add-user/popup-add-user.component";
import { PopupEditChannelComponent } from "../popup-edit-channel/popup-edit-channel.component";

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [PopupAddUserComponent, PopupEditChannelComponent],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {
  channelService = inject(ChannelService);
  uiService = inject(UiService);
  userService = inject(UserService);


  
  
}
