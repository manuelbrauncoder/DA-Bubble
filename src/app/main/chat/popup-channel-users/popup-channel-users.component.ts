import { Component, inject, Input } from '@angular/core';
import { UiService } from '../../../services/ui.service';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { PopupAddUserComponent } from '../popup-add-user/popup-add-user.component';

@Component({
  selector: 'app-popup-channel-users',
  standalone: true,
  imports: [CommonModule, PopupAddUserComponent],
  templateUrl: './popup-channel-users.component.html',
  styleUrl: './popup-channel-users.component.scss'
})
export class PopupChannelUsersComponent {
  uiService = inject(UiService);
  channelService = inject(ChannelService);
  userService = inject(UserService);
  authService = inject(FirebaseAuthService);

  @Input() showInEditChannelPopup = false;
}
