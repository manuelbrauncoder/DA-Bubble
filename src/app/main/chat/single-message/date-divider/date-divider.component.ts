import { Component, inject, Input } from '@angular/core';
import { DateMessages } from '../../../../models/message.class';
import { FormatDateForListPipe } from '../../../../pipes/format-date-for-list.pipe';
import { FirestoreService } from '../../../../services/firestore.service';

@Component({
  selector: 'app-date-divider',
  standalone: true,
  imports: [FormatDateForListPipe],
  templateUrl: './date-divider.component.html',
  styleUrl: './date-divider.component.scss'
})
export class DateDividerComponent {
  fireService = inject(FirestoreService);

  @Input() day: DateMessages = {
    date: '',
    messages: []
  }

  @Input() rootMessage = false;

  getTime(){
    if (this.rootMessage) {
      return this.fireService.getMessageFromId(this.fireService.currentThread.rootMessage).time;
    } else {
      return this.day.messages[0].time;
    }
  }
}
