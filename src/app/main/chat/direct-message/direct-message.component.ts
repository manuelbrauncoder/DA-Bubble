import { Component, inject } from '@angular/core';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { SendMessageComponent } from '../send-message/send-message.component';
import { ConversationService } from '../../../services/conversation.service';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [SingleMessageComponent, SendMessageComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  conversationService = inject(ConversationService);
}
