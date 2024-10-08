import { AfterViewChecked, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { SendMessageComponent } from '../send-message/send-message.component';
import { ConversationService } from '../../../services/conversation.service';
import { FormatDateForListPipe } from '../../../pipes/format-date-for-list.pipe';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { DateDividerComponent } from "../single-message/date-divider/date-divider.component";

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [SingleMessageComponent, SendMessageComponent, FormatDateForListPipe, CommonModule, DateDividerComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent implements AfterViewChecked{
  conversationService = inject(ConversationService);
  userService = inject(UserService);

  @ViewChild('conversationMessages') scrollContainer!: ElementRef;

  ngAfterViewChecked(): void {
    this.conversationService.scrollAtStart(this.scrollContainer);
  }

  

  
}
