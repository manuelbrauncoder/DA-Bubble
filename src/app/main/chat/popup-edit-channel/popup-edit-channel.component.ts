import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-popup-edit-channel',
  standalone: true,
  imports: [],
  templateUrl: './popup-edit-channel.component.html',
  styleUrl: './popup-edit-channel.component.scss'
})
export class PopupEditChannelComponent {
  channelService = inject(ChannelService);
  uiService = inject(UiService);
}
