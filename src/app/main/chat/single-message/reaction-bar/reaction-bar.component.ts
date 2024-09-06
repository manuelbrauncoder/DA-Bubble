import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Message } from '../../../../models/message.class';
import { ThreadService } from '../../../../services/thread.service';
import { UserService } from '../../../../services/user.service';

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

  @Input() threadMessage = false;
  @Input() currentMessage: Message = new Message()
  @Output() triggerAnswer = new EventEmitter<void>();

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }

  triggerAnswerInParent() {
    this.triggerAnswer.emit();
  }

  logMessageOut(){
    console.log(this.currentMessage);
    console.log('Thread Message?', this.threadMessage);
    
  }

  
}
