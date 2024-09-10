import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Message } from '../../../../models/message.class';
import { ThreadService } from '../../../../services/thread.service';
import { UserService } from '../../../../services/user.service';
import { UiService } from '../../../../services/ui.service';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent implements OnInit {
  threadService = inject(ThreadService);
  userService = inject(UserService);
  uiService = inject(UiService);

  @Input() threadMessage = false;
  @Input() currentMessage: Message = new Message()
  @Output() triggerAnswer = new EventEmitter<void>();
  @Output() triggerMenuPopup = new EventEmitter<void>();
  

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }

  triggerMenuPopupInParent() {
    this.triggerMenuPopup.emit();
  }

  triggerAnswerInParent() {
    this.triggerAnswer.emit();
  }

  

  
}
