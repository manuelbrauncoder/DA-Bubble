import { Component, inject } from '@angular/core';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  channelService = inject(ChannelService);

}
