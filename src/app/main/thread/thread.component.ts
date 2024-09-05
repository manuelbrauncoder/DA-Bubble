import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { SingleMessageComponent } from "../chat/single-message/single-message.component";
import { SendMessageComponent } from "../chat/send-message/send-message.component";
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [SingleMessageComponent, SendMessageComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  fireService = inject(FirestoreService);
  uiService = inject(UiService);

  formatAnswerCount(){
    return this.fireService.currentThread.messages.length === 1 ?  'Antwort' : 'Antworten';
  }
}
