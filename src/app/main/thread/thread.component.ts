import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { SingleMessageComponent } from "../chat/single-message/single-message.component";
import { SendMessageComponent } from "../chat/send-message/send-message.component";
import { UiService } from '../../services/ui.service';
import { FormatDateForListPipe } from '../../pipes/format-date-for-list.pipe';
import { DateMessages } from '../../models/message.class';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [SingleMessageComponent, SendMessageComponent, FormatDateForListPipe],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  fireService = inject(FirestoreService);
  uiService = inject(UiService);

  formatAnswerCount(){
    return this.fireService.currentThread.messages.length === 1 ?  'Antwort' : 'Antworten';
  }

  compareDate(messageDate: DateMessages){
    const rootDate = this.fireService.getFormattedDate(this.fireService.currentThread.rootMessage.time);
    if (messageDate.date === rootDate) {
      return true;
    } else {
      return false;
    }
  }
}
