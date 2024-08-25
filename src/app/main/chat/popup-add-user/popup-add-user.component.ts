import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-popup-add-user',
  standalone: true,
  imports: [],
  templateUrl: './popup-add-user.component.html',
  styleUrl: './popup-add-user.component.scss'
})
export class PopupAddUserComponent {
  channelService = inject(ChannelService);
  uiService = inject(UiService);
}
