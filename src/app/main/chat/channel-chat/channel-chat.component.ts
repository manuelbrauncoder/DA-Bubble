import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  animations: [fadeIn],
  imports: [PopupAddUserComponent, PopupEditChannelComponent, PopupChannelUsersComponent, SendMessageComponent, SingleMessageComponent, FormatDateForListPipe],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {
  channelService = inject(ChannelService);
  uiService = inject(UiService);
  userService = inject(UserService);
  authService = inject(FirebaseAuthService);



}
