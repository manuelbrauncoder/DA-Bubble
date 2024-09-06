import { AfterViewChecked, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { SendMessageComponent } from '../send-message/send-message.component';
import { ConversationService } from '../../../services/conversation.service';
import { FormatDateForListPipe } from '../../../pipes/format-date-for-list.pipe';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [SingleMessageComponent, SendMessageComponent, FormatDateForListPipe],
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

  getConversationPartner(){
    const currentUser = this.userService.getCurrentUser()
    if (currentUser.uid === this.conversationService.fireService.currentConversation.participants.first.uid) {
      return this.conversationService.fireService.currentConversation.participants.second;
    } else {
      return this.conversationService.fireService.currentConversation.participants.first;
    }
  }
}
