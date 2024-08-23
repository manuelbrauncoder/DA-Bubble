import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent{
  channelService = inject(ChannelService);
  uiService = inject(UiService);
  
}
